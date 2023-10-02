import e from "edge/edgeql-js";
import { use_await } from "$lib/hooks";
import { get_client, user_shape } from "$lib/server/client";
import { isNullish } from "malachite-ui/predicate";
import { error, redirect } from "@sveltejs/kit";

export async function load(event) {
	if (isNullish(event.locals.user)) {
		throw redirect(303, "/auth/sign-in");
	}

	const feed = await get_following_feed(event.locals.user.id);

	if (feed.failed) {
		throw error(500, { message: "Unable to load feed." });
	}

	return { feed: feed.data };
}

const post_shallow_shape = e.shape(e.Post, () => ({
  id: true,
  created_at: true,
  user: user_shape,
  text: true,
  count_bookmark: true,
  count_favourite: true,
  count_repost: true,
  is_bookmarked: true,
  is_favourited: true,
  is_highlighted: true,
  is_reposted: true,
}))

const post_deep_shape = e.shape(e.Post, (post) => ({
  ...post_shallow_shape(post),
  repost_of: post_shallow_shape
}))

function get_following_feed(current_user_id: string) {
	return use_await(() => {
		const client = get_client().withGlobals({ current_user_id });
    return e
			.select(e.Post, (post) => ({
        ...post_deep_shape(post),
				filter: e.op(post.user.is_followed, "=", true),
        order_by: {
          expression: post.created_at,
          direction: e.DESC,
        }
			}))
			.run(client);
	});
}
