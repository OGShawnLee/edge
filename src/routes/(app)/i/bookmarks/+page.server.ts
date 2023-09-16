import e from "edge/edgeql-js";
import { get_client, post_shape } from "$lib/server/client";
import { use_await } from "$lib/hooks";
import { error, redirect } from "@sveltejs/kit";
import { isNullish } from "malachite-ui/predicate";

export async function load(event) {
	if (isNullish(event.locals.user)) {
		throw redirect(303, "/auth/sign-in");
	}

  const feed = await fetch_bookmark_feed(event.locals.user.id);
  if (feed.failed) {
		console.log(feed.error)
		throw error(500, { message: "Unable to fetch bookmark feed." });
	}

	return { bookmarks: feed.data }
}


function fetch_bookmark_feed(uid: string) {
	const client = get_client();
	return use_await(() => {
		return e.select(e.Bookmark, (bookmark) => ({
			id: true,
			bookmarked_at: true,
      post: post_shape,
			filter: e.op(bookmark.user, "=", e.select(e.User, () => ({ filter_single: { id: uid } }))),
      order_by: {
				expression: bookmark.bookmarked_at,
				direction: e.DESC,
			}
		})).run(client);
	});
}
