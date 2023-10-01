import e from 'edge/edgeql-js'
import { use_await } from '$lib/hooks'
import { get_client } from '$lib/server/client'
import { error } from '@sveltejs/kit';

export async function load(event) {
  const following = await get_user_following(event.params.display_name, event.locals.user?.id)

  if (following.failed) {
    throw error(500, { message: "Unable to find user following." });
  }
  
  return { following: following.data }
}

function get_user_following(display_name: string, current_user_id?: string) {
  return use_await(() => {
    const client = get_client().withGlobals({ current_user_id })
    return e
      .select(e.Follow, (follow) => ({
        id: true,
        followed: { 
          id: true,
          name: true,
          display_name: true,
          description: true,
          is_followed: true,
        },
        filter: e.op(follow.follower.display_name, '=', display_name),
        order_by: {
          expression: follow.created_at,
          direction: e.DESC,
        }
      })).run(client)
  })
}