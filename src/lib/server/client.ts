import type { Client } from "edgedb";
import e, { createClient } from "edge/edgeql-js";

let client_instance: Client | undefined;

export function get_client() {
	if (client_instance) return client_instance;
	return (client_instance = createClient());
}

export const post_shape = e.shape(e.Post, () => ({
	id: true,
	created_at: true,
	user: { id: true, display_name: true, name: true },
	text: true,
	count_bookmark: true,
	count_favourite: true,
	count_repost: true,
	is_bookmarked: true,
	is_favourited: true,
	is_highlighted: true,
	is_reposted: true
}));

export const user_shape = e.shape(e.User, () => ({
	id: true,
	name: true,
	display_name: true
}));
