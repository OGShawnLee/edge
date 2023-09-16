import e from 'edge/edgeql-js'
import { get_client } from './client'
import { use_await } from '$lib/hooks'

export function fetch_feed() {
	const client = get_client()
	return use_await(() => 
		e.select(e.Post, (post) => ({
			id: true,
			created_at: true,
			user: { id: true, display_name: true, name: true },
			text: true,
			count_bookmark: true,
			count_favourite: true,
			order_by: {
				expression: post.created_at,
				direction: e.DESC,
			}
		})).run(client)
	)
}