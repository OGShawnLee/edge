import type { Client } from "edgedb";
import e from "edge/edgeql-js";
import { fetch_feed } from "$lib/server/feed";
import { use_await, use_catch } from "$lib/hooks";
import { get_client } from "$lib/server/client";
import { post_schema } from "$lib/valibot";
import { error, fail, redirect } from "@sveltejs/kit";
import { isNullish } from "malachite-ui/predicate";
import { parse } from "valibot";

export async function load(event) {
	if (isNullish(event.locals.user)) {
		throw redirect(303, "/auth/sign-in");
	}

	const feed = await fetch_feed();
	if (feed.failed) {
		throw error(500, { message: "Unable to load feed." });
	}

	return { feed: feed.data, user: event.locals.user };
}

export const actions = {
	bookmark: async (event) => {
		if (isNullish(event.locals.user)) {
			throw redirect(303, "/auth/sign-in");
		}

		const data = await event.request.formData();
		const id = data.get("id");

		if (typeof id !== "string") return fail(400);

		const result = await handle_bookmark(event.locals.user.id, id);
		if (result.failed) {
			throw error(500, { message: "Unable to create or delete bookmark." })
		}

		return { operation: result.data };
	},
	post: async (event) => {
		if (isNullish(event.locals.user)) {
			throw redirect(303, "/auth/sign-in");
		}

		const data = await event.request.formData();
		const post_text = data.get("post");

		const text_result = use_catch(() => parse(post_schema, post_text));
		if (text_result.failed) return fail(400);

		const post = await create_post(event.locals.user.id, text_result.data);
		if (post.failed) return fail(500);
	}
};

function create_bookmark(user_id: string, post_id: string) {
	return e.insert(e.Bookmark, {
		user: e.select(e.User, () => ({ filter_single: { id: user_id } })),
		post: e.select(e.Post, () => ({ filter_single: { id: post_id } }))
	});
}

function create_post(user_id: string, post: string) {
	const client = get_client();
	return use_await(() => {
		return e
			.insert(e.Post, {
				user: e.select(e.User, () => ({ filter_single: { id: user_id } })),
				text: post
			})
			.run(client);
	});
}
function delete_bookmark(user_id: string, post_id: string) {
	return e.delete(e.Bookmark, () => ({
		filter_single: {
			user: e.select(e.User, () => ({ filter_single: { id: user_id } })),
			post: e.select(e.Post, () => ({ filter_single: { id: post_id } }))
		}
	}));
}

// i tried defining a edgeql function but failed
function handle_bookmark(user_id: string, post_id: string) {
	const client = get_client();
	return use_await(async () => {
		// ? we doing two round database trips -> slow! 
		const bookmark = await get_bookmark(user_id, post_id).run(client);
		if (bookmark) {
			const deletion = await delete_bookmark(user_id, post_id).run(client);
			return deletion ? "deleted" : "not-found"
		} else {
			await create_bookmark(user_id, post_id).run(client);
			return "created"
		}
	});
}

function get_bookmark(user_id: string, post_id: string) {
	return e.select(e.Bookmark, () => ({
		id: true,
		filter_single: {
			user: e.select(e.User, () => ({ filter_single: { id: user_id } })),
			post: e.select(e.Post, () => ({ filter_single: { id: post_id } }))
		}
	}));
}
