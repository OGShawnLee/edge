import { redirect } from "@sveltejs/kit";
import { delete_auth_cookie } from "$lib/server/auth";

export function load() {
	throw redirect(303, "/home");
}

export const actions = {
	default: (event) => {
		delete_auth_cookie(event.cookies);
		throw redirect(303, "/auth/sign-in");
	}
};
