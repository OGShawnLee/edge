import { redirect } from "@sveltejs/kit";
import { isNullish } from "malachite-ui/predicate";

export function load(event) {
	if (isNullish(event.locals.user)) {
		throw redirect(303, "/auth/sign-in");
	}

	return { user: event.locals.user };
}
