import { error, redirect } from "@sveltejs/kit";
import { fetch_feed } from '$lib/server/feed'

export async function load(event) {
	if (event.locals.user) throw redirect(303, "/home");

	const feed = await fetch_feed()
	if (feed.failed) {
		throw error(500, { message: "Unable to load feed." })
	}

	return { feed: feed.data, user: event.locals.user };
}
