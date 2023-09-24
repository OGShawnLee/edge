import e from "edge/edgeql-js";
import { get_client } from "./client";
import { use_await } from "$lib/hooks";

export function fetch_feed(current_user_id?: string) {
	const client = get_client().withGlobals({ current_user_id });
	return use_await(() =>
		e
			.select(e.Post, (post) => ({
				id: true,
				created_at: true,
				user: { id: true, display_name: true, name: true },
				text: true,
				count_bookmark: true,
				count_favourite: true,
				is_bookmarked: true,
				is_favourited: true,
				is_highlighted: true,
				order_by: {
					expression: post.created_at,
					direction: e.DESC
				}
			}))
			.run(client)
	);
}
