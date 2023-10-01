import e from "edge/edgeql-js";
import { use_await } from "$lib/hooks";
import { get_client, post_shape } from "$lib/server/client";
import { error } from "@sveltejs/kit";

export async function load(event) {
	const favourites = await fetch_user_favourites_by_display_name(
		event.params.display_name,
		event.locals.user.id
	);

	if (favourites.failed) {
		throw error(500, { message: "Unable to fetch user likes." });
	}

	return { favourites: favourites.data };
}

function fetch_user_favourites_by_display_name(display_name: string, current_user_id?: string) {
	const client = get_client().withGlobals({ current_user_id });
	return use_await(() =>
		e
			.select(e.Favourite, (favourite) => ({
				id: true,
				post: post_shape,
				filter: e.op(favourite.user.display_name, "=", display_name),
				order_by: {
					expression: favourite.created_at,
					direction: e.DESC
				}
			}))
			.run(client)
	);
}
