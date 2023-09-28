import type { Client } from "edgedb";
import e, { createClient } from "edge/edgeql-js";

let client_instance: Client | undefined;

export function get_client() {
	if (client_instance) return client_instance;
	return (client_instance = createClient());
}

export function create_post_query(post_id: string) {
	return e.select(e.Post, () => ({
		id: true,
		filter_single: { id: post_id }
	}));
}

export function create_user_query(user_id: string) {
	return e.select(e.User, () => ({
		id: true,
		filter_single: { id: user_id }
	}));
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
