import type { Input, Issues } from "valibot";
import e from "edge/edgeql-js";
import { set_auth_cookie } from "$lib/server/auth";
import { use_await, use_catch } from "$lib/hooks";
import { get_client } from "$lib/server/client";
import { error, fail } from "@sveltejs/kit";
import { isNullish } from "malachite-ui/predicate";
import { flatten, parse, pick } from "valibot";
import { user_schema } from "$lib/valibot";

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

const edit_schema = pick(user_schema, ["name", "description", "location"]);

export const actions = {
	"edit-profile": async ({ cookies, request, locals }) => {
		if (isNullish(locals.user)) {
			throw error(401, { message: "You have to sign in before updating your profile!" });
		}

		const data = await request.formData();
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

		const updated_user = await update_user(locals.user.id, user.data);
		if (updated_user.failed) {
			return fail(500, {
				issue: "Unable to update user.",
				description: { value: description as string },
				location: { value: location as string },
				name: { value: name as string }
			});
		}

		if (isNullish(updated_user.data)) {
			throw error(404, { message: "User to be updated does not exist." });
		}

		set_auth_cookie(cookies, {
			id: locals.user.id,
			display_name: locals.user.display_name,
			name: user.data.name
		});
	}
};

function fetch_user_posts_by_display_name(display_name: string, current_user_id?: string) {
	const client = get_client().withGlobals({ current_user_id });
	return use_await(() => {
		return e
			.select(e.Post, (post) => ({
				id: true,
				created_at: true,
				text: true,
				count_bookmark: true,
				count_favourite: true,
				is_favourite: true,
				order_by: {
					expression: post.created_at,
					direction: e.DESC
				},
				filter: e.op(post.user.display_name, "=", display_name)
			}))
			.run(client);
	});
}

function update_user(uid: string, data: Input<typeof edit_schema>) {
	const client = get_client();
	return use_await(() => {
		return e
			.update(e.User, () => ({
				set: data,
				filter_single: { id: uid }
			}))
			.run(client);
	});
}
