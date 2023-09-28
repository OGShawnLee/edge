import type { Event } from "edge/interfaces";
import type { Enum } from "valibot";
import e from "edge/edgeql-js";
import { enumType, object, parse, string } from "valibot";
import { get_client, create_post_query, create_user_query } from "$lib/server/client";
import { use_await } from "$lib/hooks";

const notification_schema = object({
	post_id: string(),
	receiver_id: string(),
	sender_id: string(),
	event: enumType<string, Enum<Event>>(["favourite", "repost"])
});

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
