import { redirect } from "@sveltejs/kit";

export function load(event) {
	if (event.locals.user) throw redirect(303, "/home");
}
