import e from "edge/edgeql-js";
import { get_client, post_shape } from "$lib/server/client";
import { use_await } from "$lib/hooks";
import { error } from "@sveltejs/kit";

export async function load(event) {
	const highlights = await get_highlights(event.params.display_name, event.locals.user?.id);

	if (highlights.failed) {
		throw error(500, { message: "Unable to fetch user highlights." });
	}

	return {
		highlights: highlights.data
	};
}

function get_highlights(display_name: string, current_user_id?: string) {
	const client = get_client().withGlobals({ current_user_id });
	return use_await(() =>
		e
			.select(e.Highlight, (highlight) => ({
				id: true,
				post: post_shape,
				filter: e.op(highlight.user.display_name, "=", display_name),
				order_by: {
					expression: highlight.created_at,
					direction: e.DESC
				}
			}))
			.run(client)
	);
}
