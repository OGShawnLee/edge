import { delete_auth_cookie, get_current_user } from "$lib/server/auth";
import { redirect } from "@sveltejs/kit";

export async function handle({ event, resolve }) {
	const user = await get_current_user(event.cookies);

	if (user.failed) {
		if (user.reason === "INVALID") {
			delete_auth_cookie(event.cookies);
			event.locals.user = null;
			throw redirect(303, "/auth/sign-in");
		}

		event.locals.user = null;
	} else {
		event.locals.user = user.data;

		const route = event.route.id;
		if (route === "/auth/sign-in" || route === "/auth/sign-up") {
			throw redirect(303, "/home");
		}
	}

	return resolve(event);
}
