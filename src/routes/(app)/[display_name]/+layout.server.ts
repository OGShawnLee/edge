import e from "edge/edgeql-js";
import { use_await } from "$lib/hooks";
import { get_client, post_shape } from "$lib/server/client";
import { error } from "@sveltejs/kit";
import { isNullish } from "malachite-ui/predicate";

export async function load(event) {
	const found_user = await find_user(event.params.display_name, event.locals.user?.id);

	if (found_user.failed) {
		throw error(500, { message: "Unable to find user." });
	}

	if (isNullish(found_user.data)) {
		throw error(404, { message: "User does not exist." });
	}

	return { found_user: found_user.data };
}

function find_user(display_name: string, current_user_id?: string) {
	return use_await(() => {
		const client = get_client().withGlobals({ current_user_id });
		return e
			.select(e.User, () => ({
				id: true,
				created_at: true,
				display_name: true,
				name: true,
				description: true,
				location: true,
				count_favourite: true,
				count_follower: true,
				count_following: true,
				count_highlight: true,
				count_post: true,
				is_followed: true,
				is_following: true,
				pinned_post: post_shape,
				filter_single: { display_name }
			}))
			.run(client);
	});
}
