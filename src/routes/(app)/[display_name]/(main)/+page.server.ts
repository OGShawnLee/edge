import type { Input, Issues } from "valibot";
import e from "edge/edgeql-js";
import { set_auth_cookie } from "$lib/server/auth";
import { use_await, use_catch } from "$lib/hooks";
import { create_user_query, get_client, post_shape } from "$lib/server/client";
import { error, fail } from "@sveltejs/kit";
import { isNullish } from "malachite-ui/predicate";
import { flatten, parse, pick } from "valibot";
import { user_schema } from "$lib/valibot";
import { put } from "@vercel/blob";
import { BLOB_READ_WRITE_TOKEN } from "$env/static/private";

export const prerender = false;

export async function load(event) {
	const posts = await fetch_user_posts_by_display_name(
		event.params.display_name,
		event.locals.user?.id
	);

	if (posts.failed) {
		throw error(500, { message: "Unable to find user." });
	}

	if (isNullish(posts.data)) {
		throw error(404, { message: "User does not exist." });
	}

	return { posts: posts.data };
}

const edit_schema = pick(user_schema, ["avatar", "name", "description", "location"]);

export const actions = {
	"edit-profile": async ({ cookies, request, locals }) => {
		if (isNullish(locals.user)) {
			throw error(401, { message: "You have to sign in before updating your profile!" });
		}

		const data = await request.formData();
		const avatar = data.get("avatar") as File;
		const description = data.get("description");
		const name = data.get("name");
		const location = data.get("location");

		const user = use_catch(() => parse(edit_schema, { description, name, location }));
		if (user.failed) {
			const issues = flatten(user.error as Issues).nested;
			return fail(400, {
				description: { issue: issues.description?.[0], value: description as string },
				location: { issue: issues.location?.[0], value: location as string },
				name: { issue: issues.name?.[0], value: name as string }
			});
		}

		const user_result = await update_user(locals.user.id, user.data, avatar);
		if (user_result.failed) {
			console.log(user_result.error)
			return fail(500, {
				issue: "Unable to update user.",
				description: { value: description as string },
				location: { value: location as string },
				name: { value: name as string }
			});
		}

		if (isNullish(user_result.data)) {
			throw error(404, { message: "User to be updated does not exist." });
		}

		set_auth_cookie(cookies, {
			id: locals.user.id,
			avatar: user_result.data.avatar ?? "",
			display_name: locals.user.display_name,
			name: user.data.name
		});
	},
	follow: async ({ locals, request, params }) => {
		if (isNullish(locals.user)) {
			throw error(401, { message: "You have to sign in before following someone!" });
		}

		if (locals.user.display_name === params.display_name) {
			throw error(400, { message: "You cannot follow yourself!" });
		}

		const data = await request.formData();
		const id = data.get("id");

		if (typeof id !== "string") return fail(400);

		const follow = await toggle_follow(id, locals.user.id);

		if (follow.failed) {
			throw error(500, { message: "Unable to follow user." });
		}

		return { operation: follow.data };
	}
};

function fetch_user_posts_by_display_name(display_name: string, current_user_id?: string) {
	const client = get_client().withGlobals({ current_user_id });
	return use_await(() => {
		return e
			.select(e.Post, (post) => ({
				id: true,
				created_at: true,
				repost_of: post_shape,
				text: true,
				count_bookmark: true,
				count_favourite: true,
				count_repost: true,
				is_bookmarked: true,
				is_favourited: true,
				is_highlighted: true,
				is_reposted: true,
				order_by: {
					expression: post.created_at,
					direction: e.DESC
				},
				filter: e.op(post.user.display_name, "=", display_name)
			}))
			.run(client);
	});
}

function toggle_follow(uid: string, current_user_id: string) {
	return use_await(async () => {
		const client = get_client().withGlobals({ current_user_id });
		const follow = await e
			.select(e.Follow, () => ({
				id: true,
				filter_single: {
					followed: create_user_query(uid),
					follower: create_user_query(current_user_id)
				}
			}))
			.run(client);

		if (follow) {
			const deleted = await e
				.delete(e.Follow, () => ({
					filter_single: { id: follow.id }
				}))
				.run(client);
			return deleted ? "deleted" : "not-found";
		}

		e.insert(e.Follow, {
			follower: create_user_query(current_user_id),
			followed: create_user_query(uid)
		}).run(client);

		return "created";
	});
}

function update_user(uid: string, data: Input<typeof edit_schema>, file: File | undefined) {
	return use_await(async () => {
		
		if (file) {
			console.log("uploading")
			const response = await put("/avatar/" + uid, file, {
				access: "public",
				token: BLOB_READ_WRITE_TOKEN
			});
			console.log(file, "Run")
			data.avatar = response.url;
			console.log(response ?? "Nope");
		}

		// console.log("After", data)

		// const client = get_client();
		// const user = await e
		// 	.update(e.User, () => ({
		// 		set: data,
		// 		filter_single: { id: uid }
		// 	}))
		// 	.run(client);

		// return user ? { id: user.id, avatar: data.avatar } : null;
	});
}
