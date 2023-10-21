import type { Event } from "edge/interfaces";
import type { Enum } from "valibot";
import e from "edge/edgeql-js";
import { array, enumType, object, parse, string } from "valibot";
import { create_post_query, create_user_query, each_to_uuid, get_client } from "$lib/server/client";
import { use_await, use_catch } from "$lib/hooks";
import { isNullish } from "malachite-ui/predicate";

const notification_schema = object({
	post_id: string(),
	receiver_id: string(),
	sender_id: string(),
	event: enumType<string, Enum<Event>>(["favourite", "repost"])
});

const notifications_schema = array(string());

export async function POST(event) {
	if (event.isSubRequest) {
		const data = await event.request.json();
		const entities = parse(notification_schema, data);
		const result = await create_notification(
			entities.post_id,
			entities.receiver_id,
			entities.sender_id,
			entities.event
		);

		if (result.failed) {
			console.log(result.error);
		}

		return new Response(null);
	} else return new Response(null, { status: 403 });
}

export async function PATCH(event) {
	if (isNullish(event.locals.user)) {
		return new Response(null, { status: 403 });
	}

	const data = await event.request.json();
	const seen_notifications = use_catch(() => {
		return parse(notifications_schema, data);
	});

	if (seen_notifications.failed) {
		return new Response(null, { status: 400 });
	}

	const result = await see_notifications(event.locals.user.id, seen_notifications.data);

	if (result.failed) {
		return new Response(null, { status: 500 });
	}

	return new Response(null, { status: 200 });
}

function create_notification(
	post_id: string,
	receiver_id: string,
	sender_id: string,
	event: Event
) {
	const client = get_client();
	return use_await(() => {
		return e
			.insert(e.Notification, {
				post: create_post_query(post_id),
				sender: create_user_query(sender_id),
				receiver: create_user_query(receiver_id),
				event
			})
			.run(client);
	});
}

function see_notifications(user_id: string, seen_notifications: string[]) {
	return use_await(async () => {
		const client = get_client().withGlobals({ current_user_id: user_id });
		return client.transaction(async (transaction) => {
			await e
				.for(e.set(...each_to_uuid(seen_notifications)), (notification_id) => {
					return e.update(e.Notification, () => ({
						set: { is_unseen: false },
						filter_single: { id: notification_id }
					}));
				})
				.run(transaction);
			return e
				.update(e.User, (user) => {
					return {
						set: {
							count_unseen_notifications: e.op(user.count_unseen_notifications, "-", 1)
						},
						filter_single: { id: user_id }
					};
				})
				.run(transaction);
		});
	});
}
