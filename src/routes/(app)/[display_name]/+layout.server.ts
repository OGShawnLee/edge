import e from "edge/edgeql-js";
import { use_await } from "$lib/hooks";
import { get_client } from "$lib/server/client";
import { error } from "@sveltejs/kit";
import { isNullish } from "malachite-ui/predicate";

export async function load(event) {
	const found_user = await get_user_by_display_name(event.params.display_name);

	if (found_user.failed) {
		throw error(500, { message: "Unable to find user." });
	}

	if (isNullish(found_user.data)) {
		throw error(404, { message: "User does not exist." });
	}

	return { found_user: found_user.data };
}

function get_user_by_display_name(display_name: string) {
	const client = get_client();
	return use_await(() => {
		return e
			.select(e.User, () => ({
				id: true,
				created_at: true,
				display_name: true,
				name: true,
				description: true,
				location: true,
				filter_single: { display_name }
			}))
			.run(client);
	});
}
