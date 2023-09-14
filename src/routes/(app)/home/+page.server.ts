import e from 'edge/edgeql-js'
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

	const feed = await fetch_feed()
	if (feed.failed) {
		throw error(500, { message: "Unable to load feed." })
	}

	return { feed: feed.data, user: event.locals.user };
}

export const actions = {
	post: async (event) => {
		if (isNullish(event.locals.user)) {
			throw redirect(303, "/auth/sign-in");
		}

		const data = await event.request.formData();
		const post_text = data.get("post")

		const text_result = use_catch(() => parse(post_schema, post_text));
		if (text_result.failed) return fail(400);

		const post = await create_post(event.locals.user.id, text_result.data);
		if (post.failed) return fail(500);
	}
};

function create_post(uid: string, post: string) {
	const client = get_client()
	return use_await(() => {
		return e.insert(e.Post, {
			user: e.select(e.User, () => ({ filter_single: { id: uid } })),
			text: post
		}).run(client)
	})
}

function fetch_feed() {
	const client = get_client()
	return use_await(() => 
		e.select(e.Post, (post) => ({
			id: true,
			created_at: true,
			user: { id: true, display_name: true, name: true },
			text: true,
			order_by: {
				expression: post.created_at,
				direction: e.DESC,
			}
		})).run(client)
	)
}