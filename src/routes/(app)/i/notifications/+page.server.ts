import e from 'edge/edgeql-js'
import { get_client } from "$lib/server/client";
import { use_await } from "$lib/hooks";
import { isNullish } from "malachite-ui/predicate";
import { error, redirect } from "@sveltejs/kit";

export async function load(event) {
	if (isNullish(event.locals.user)) {
		throw redirect(303, "/auth/sign-in");
	}

	const notifications = await fetch_notifications(event.locals.user.id);

	if (notifications.failed) {
		console.log(notifications.error);
		throw error(500, { message: "Unable to fetch notifications" });
	}

	return { notifications: notifications.data };
}

function fetch_notifications(user_id: string) {
	const client = get_client();
	return use_await(async () => {
    return e.select(e.Notification, (notification) => ({
      id: true, 
      created_at: true,
      event: true,
      sender: { display_name: true, name: true },
      post: { text: true },
      filter: e.op(notification.receiver.id, "=", e.uuid(user_id)),
      order_by: {
        expression: notification.created_at,
        direction: e.DESC,
      }
    })).run(client)
	});
}
