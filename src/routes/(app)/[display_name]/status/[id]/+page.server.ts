import e from "edge/edgeql-js";
import { use_await } from "$lib/hooks";
import { get_client, post_shape } from "$lib/server/client";
import { error } from "@sveltejs/kit";
import { isNullish } from "malachite-ui/predicate";

export async function load(event) {
  const post = await find_user_post(
		event.params.display_name, 
		event.params.id, 
		event.locals.user?.id
	);

	if (post.failed) {
		throw error(500, { message: "Unable to find post." });
	}

	if (isNullish(post.data)) {
		throw error(404, { message: "Post not found." });
	}

	if (isNullish(post.data.text)) {
		throw error(400, { message: "Can't view a repost." });	
	}

	return { found_post: post.data }
}

function find_user_post(display_name: string, post_id: string, current_user_id?: string) {
	return use_await(() => {
		const client = get_client().withGlobals({ current_user_id });
    return e.select(e.Post, (post) => ({
			...post_shape(post),
			filter_single: { id: post_id },
		})).run(client);
	});
}
