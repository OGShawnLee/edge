import e from 'edge/edgeql-js'
import { get_client } from '$lib/server/client'
import { use_await } from '$lib/hooks';
import { error, redirect } from '@sveltejs/kit';
import { isNullish } from 'malachite-ui/predicate';

export async function load(event) {
  if (isNullish(event.locals.user)) {
		throw redirect(303, "/auth/sign-in");
	}

  const user = await use_await(() => {
    const client = get_client();
    return e.select(e.User, () => ({
      count_following: true,
      filter_single: { id: event.locals.user!.id }
    })).run(client)
  })

  if (user.failed) {
    throw error(500, { message: "Failed to load user" })
  };

  return { count_following: user.data?.count_following ?? 0 }
}