import e from "edge/edgeql-js";
import { object, parse, string } from "valibot";
import { get_client } from "$lib/server/client";
import { use_await } from "$lib/hooks/index.js";

const notification_schema = object({
	post_id: string(),
	receiver_id: string(),
	sender_id: string()
});

export async function POST(event) {
	if (event.isSubRequest) {
		const data = await event.request.json();
		const entities = parse(notification_schema, data);
		const result = await create_notification(entities.post_id, entities.receiver_id, entities.sender_id);

		if (result.failed) {
			console.log(result.error);
		}

		return new Response(null);
	} else return new Response(null, { status: 403 });
}

function create_notification(post_id: string, receiver_id: string, sender_id: string) {
	const client = get_client();
	return use_await(() => {
		return e
			.insert(e.Notification, {
				post: e.select(e.Post, () => ({ filter_single: { id: post_id } })),
				sender: e.select(e.User, () => ({ filter_single: { id: sender_id } })),
				receiver: e.select(e.User, () => ({ filter_single: { id: receiver_id } })),
				event: "favourite"
			})
			.run(client);
	});
}
