import type { JWTPayloadState } from "@types";
import type { Cookies } from "@sveltejs/kit";
import { ACCESS_TOKEN, AUTH_COOKIE } from "$env/static/private";
import { verify } from "jsonwebtoken";
import { isInterface, isNullish, isString, isWhitespace } from "malachite-ui/predicate";
import { use_catch } from "$lib/hooks";

export function delete_auth_cookie(cookies: Cookies) {
	cookies.set(AUTH_COOKIE, "", { expires: new Date(Date.now() - 3600), httpOnly: true, path: "/" });
}

export async function get_current_user(cookies: Cookies): Promise<
	| {
			failed: true;
			reason: "UNAUTHENTICATED" | "INVALID";
	  }
	| { failed: false; data: JWTPayloadState }
> {
	const auth_cookie = cookies.get(AUTH_COOKIE);
	if (isNullish(auth_cookie) || isWhitespace(auth_cookie))
		return { failed: true, reason: "UNAUTHENTICATED" };

	const auth_token_state = await get_auth_token_state(auth_cookie);
	if (auth_token_state.failed) return { failed: true, reason: "INVALID" };

	return { failed: false, data: auth_token_state.data };
}

function get_auth_token_state(auth_cookie: string) {
	return use_catch(() => {
		const payload = verify(auth_cookie, ACCESS_TOKEN);
		if (is_auth_token_state(payload)) return payload;
		throw Error("Invalid Auth Token");
	});
}

export function is_auth_token_state(value: unknown): value is JWTPayloadState {
	return isInterface<JWTPayloadState>(value, {
		id: isString,
		display_name: isString,
		name: isString
	});
}
