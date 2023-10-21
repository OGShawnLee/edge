import e from 'edge/edgeql-js'
import { get_client } from '$lib/server/client'
import { use_await } from '$lib/hooks';
import { error, redirect } from '@sveltejs/kit';
import { isNullish } from 'malachite-ui/predicate'

export async function load(event) {
  if (isNullish(event.locals.user)) {
    throw redirect(303, "/auth/sign-in");
  }

  const user = await use_await(() => {
    const client = get_client();
    return e.select(e.User, (user) => ({
      count_unseen_notifications: true,
      filter_single: {
        id: event.locals.user!.id
      }
    })).run(client);
  })

  if (user.failed) {
    console.log(user.error)
    throw error(500, { message: "Unable to fetch notifications" });
  }

  if (isNullish(user.data)) {
    throw error(500, { message: "User does not exist" })
  }

  return { count_unseen_notifications: user.data.count_unseen_notifications };
}