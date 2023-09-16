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
	
		const controller = new Record(e.Bookmark, id, event.locals.user.id)
		const result = await controller.toggle_record();
		if (result.failed) {
			throw error(500, { message: "Unable to create or delete bookmark." })
		}

		return { operation: result.data };
	},
	favourite: async event => {
		if (isNullish(event.locals.user)) {
			throw redirect(303, "/auth/sign-in");
		}
		
		const data = await event.request.formData();
		const id = data.get("id");
		
		if (typeof id !== "string") return fail(400);
		
		const controller = new Record(e.Bookmark, id, event.locals.user.id)
		const result = await controller.toggle_record()
		
		if (result.failed) {
			throw error(500, { message: "Unable to create or delete favourite." })
		}

		return { operation: result.data }
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

class Record {
	readonly client = get_client();

	constructor(
		readonly element: typeof e.Bookmark | typeof e.Favourite,
		readonly post_id: string, 
		readonly user_id: string,
	) {}

	private get_record(this: Record) {
		return e.select(this.element, () => ({
			id: true,
			filter_single: {
				post: e.select(e.Post, () => ({ filter_single: { id: this.post_id } })),
				user: e.select(e.User, () => ({ filter_single: { id: this.user_id } }))
			}
		})).run(this.client);
	}

	private create_record(this: Record) {
		return e.insert(this.element, {
			user: e.select(e.User, () => ({ filter_single: { id: this.user_id } })),
			post: e.select(e.Post, () => ({ filter_single: { id: this.post_id } }))
		}).run(this.client);
	}
	
	private delete_record(this: Record, id: string) {
		return e.delete(this.element, () => ({
			filter_single: { id }
		})).run(this.client);
	}

	// tried defining an edgedb fn but they are pure functions...
	toggle_record(this: Record) {
		return use_await(async () => {
			// ? we are doing two round database trips which is slow 
			const record = await this.get_record();
			if (record) {
				const deletion = await this.delete_record(record.id);
				return deletion ? "deleted" : "not-found"
			} else {
				await this.create_record();
				return "created"
			}
		});
	}
}
