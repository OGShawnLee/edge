import type { RequestEvent } from "@sveltejs/kit";
import type { Event } from "edge/interfaces";
import e from "edge/edgeql-js";
import { PINNED_POST_COOKIE } from "$env/static/private";
import { fetch_feed } from "$lib/server/feed";
import { use_await, use_catch } from "$lib/hooks";
import { get_client, create_post_query, create_user_query } from "$lib/server/client";
import { post_schema } from "$lib/valibot";
import { error, fail, redirect } from "@sveltejs/kit";
import { isNullish } from "malachite-ui/predicate";
import { parse } from "valibot";

export async function load(event) {
	if (isNullish(event.locals.user)) {
		throw redirect(303, "/auth/sign-in");
	}

	const feed = await fetch_feed(event.locals.user.id);
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

		const controller = new Record(e.Bookmark, id, event.locals.user.id);
		const result = await controller.toggle_record();
		if (result.failed) {
			throw error(500, { message: "Unable to create or delete bookmark." });
		}

		return { operation: result.data };
	},
	favourite: async (event) => {
		if (isNullish(event.locals.user)) {
			throw redirect(303, "/auth/sign-in");
		}

		const data = await event.request.formData();
		const id = data.get("id");

		if (typeof id !== "string") return fail(400);

		const controller = new Record(e.Favourite, id, event.locals.user.id);
		const result = await controller.toggle_record(event);

		if (result.failed) {
			throw error(500, { message: "Unable to create or delete favourite." });
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

		if (event.url.searchParams.has("with-redirect")) { 
			throw redirect(303, "/" + event.locals.user.display_name + "/status/" + post.data.id);
		}
	},
	repost: async (event) => {
		if (isNullish(event.locals.user)) {
			throw redirect(303, "/auth/sign-in");
		}

		const data = await event.request.formData();
		const id = data.get("id");

		if (typeof id !== "string") return fail(400);

		const client = get_client();
		const post_reposted = await e
			.select(e.Post, () => ({
				id: true,
				repost_of: true,
				user: true,
				filter_single: { id }
			}))
			.run(client);

		if (isNullish(post_reposted)) {
			throw error(400, { message: "Cannot repost that does not exist." });
		}

		if (post_reposted.repost_of) {
			throw error(400, { message: "Cannot repost a repost." });
		}

		const repost = await insert_repost(event.locals.user.id, id);
		if (repost.failed) {
			throw error(500, { message: "Unable to repost." });
		}

		trigger_notification(event, {
			post_id: id,
			sender_id: event.locals.user.id,
			receiver_id: post_reposted.user.id,
			event: "repost"
		});
		return { operation: "created" };
	},
	highlight: async (event) => {
		if (isNullish(event.locals.user)) {
			throw redirect(303, "/auth/sign-in");
		}

		const data = await event.request.formData();
		const id = data.get("id");

		if (typeof id !== "string") return fail(400);

		const controller = new Record(e.Highlight, id, event.locals.user.id);
		const result = await controller.toggle_record(event);

		if (result.failed) {
			throw error(500, { message: "Unable to create or delete highlight." });
		}

		return { operation: result.data };
	},
	"pin-post": async (event) => {
		if (isNullish(event.locals.user)) {
			throw redirect(303, "/auth/sign-in");
		}

		const data = await event.request.formData();
		const id = data.get("id");

		const pinned_post_id = event.cookies.get(PINNED_POST_COOKIE);

		if (typeof id !== "string") return fail(400);

		const result = await toggle_pin(id, event.locals.user.id, pinned_post_id === id);
		if (result.failed) {
			if (result.error === 403) throw error(403, { message: "Cannot pin another user's post." });
			throw error(500, { message: "Unable to pin post." });
		}

		if (result.data === "deleted") {
			event.cookies.set(PINNED_POST_COOKIE, "", { path: "/", httpOnly: true });
		} else if (result.data === "created") {
			event.cookies.set(PINNED_POST_COOKIE, id, { path: "/", httpOnly: true });
		}

		return { operation: result.data };
	}
};

function toggle_pin(id: string, current_user_id: string, is_pinned: boolean) {
	return use_await(async () => {
		const client = get_client();

		if (is_pinned) {
			const deleted = await e
				.update(e.User, (user) => ({
					set: { pinned_post: null },
					filter_single: { id: current_user_id }
				}))
				.run(client);
			if (deleted?.id) return "deleted";
			return "not-found";
		}

		const user = await create_post_query(id).user.run(client);

		if (user?.id !== current_user_id) throw 404;

		await e
			.update(e.User, () => ({
				set: { pinned_post: create_post_query(id) },
				filter_single: { id: current_user_id }
			}))
			.run(client);

		return "created";
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

class Record {
	readonly client = get_client();

	constructor(
		readonly element: typeof e.Bookmark | typeof e.Favourite | typeof e.Highlight,
		readonly post_id: string,
		readonly user_id: string
	) {}

	private get_record(this: Record) {
		return e
			.select(this.element, () => ({
				id: true,
				filter_single: {
					post: create_post_query(this.post_id),
					user: create_user_query(this.user_id)
				}
			}))
			.run(this.client);
	}

	private create_record(this: Record) {
		const record = e.insert(this.element, {
			user: create_user_query(this.user_id),
			post: create_post_query(this.post_id)
		});

		return e
			.select(record, () => ({
				id: true,
				post: { user: { id: true } }
			}))
			.run(this.client);
	}

	private delete_record(this: Record, id: string) {
		return e
			.delete(this.element, () => ({
				filter_single: { id }
			}))
			.run(this.client);
	}

	// tried defining an edgedb fn but they are pure functions...
	toggle_record(this: Record, event?: RequestEvent) {
		return use_await(async () => {
			// ? we are doing two round database trips which is slow
			const record = await this.get_record();
			if (record) {
				const deletion = await this.delete_record(record.id);
				return deletion ? "deleted" : "not-found";
			} else {
				const record = await this.create_record();
				this.trigger_notification(record.post.user.id, event);
				return "created";
			}
		});
	}

	private trigger_notification(this: Record, receiver_id: string, request_event?: RequestEvent) {
		if (this.element === e.Bookmark) return;
		if (isNullish(request_event))
			throw "request event must be provided to trigger notification event!";
		trigger_notification(request_event, {
			post_id: this.post_id,
			sender_id: this.user_id,
			receiver_id,
			event: "favourite"
		});
	}
}

function insert_repost(user_id: string, post_id: string) {
	return use_await(() =>
		e
			.insert(e.Repost, {
				user: create_user_query(user_id),
				post: create_post_query(post_id)
			})
			.run(get_client())
	);
}

function trigger_notification(
	request_event: RequestEvent,
	entities: {
		post_id: string;
		sender_id: string;
		receiver_id: string;
		event: Event;
	}
) {
	if (entities.sender_id === entities.receiver_id) return;
	request_event.fetch("/api/notification", {
		method: "POST",
		body: JSON.stringify(entities)
	});
}
