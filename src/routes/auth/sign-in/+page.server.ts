import type { Issues } from "valibot";
import type { Cookies } from "@sveltejs/kit";
import e from "edge/edgeql-js";
import { user_schema } from "$lib/valibot";
import { parse, pick, flatten } from "valibot";
import { use_await, use_catch } from "$lib/hooks";
import { error, fail, redirect } from "@sveltejs/kit";
import { get_client } from "$lib/server/client";
import { compare } from "bcrypt";
import { isNullish } from "malachite-ui/predicate";
import { ACCESS_TOKEN, AUTH_COOKIE } from "$env/static/private";
import { sign } from "jsonwebtoken";

const login_schema = pick(user_schema, ["display_name", "password"]);

export const actions = {
	default: async (event) => {
		const data = await event.request.formData();
		const display_name = data.get("display-name");
		const password = data.get("password");

		const user = use_catch(() => {
			return parse(login_schema, { display_name, password });
		});
		if (user.failed) {
			const issues = flatten(user.error as Issues).nested;
			return fail(400, {
				display_name: { issue: issues.display_name?.[0], value: display_name as string },
				password: { issue: issues.password?.[0] }
			});
		}

		const client = get_client();
		const found_user = await use_await(() => {
			return e
				.select(e.User, () => {
					return {
						id: true,
						name: true,
						password: true,
						filter_single: { display_name: user.data.display_name }
					};
				})
				.run(client);
		});
		if (found_user.failed) {
			throw error(500, { message: "Unable to sign in." });
		}
		if (isNullish(found_user.data)) {
			return fail(400, {
				display_name: { issue: "User does not exist.", value: user.data.display_name }
			});
		}

		const correct_password = await is_correct_password(user.data.password, found_user.data.password);
		if (correct_password.failed) {
			return fail(400, {
				password: { issue: "Unable to verify password." }
			});
		}

		if (correct_password.data) {
			set_auth_cookie(event.cookies, {
				id: found_user.data.id,
				display_name: user.data.display_name,
				name: found_user.data.name
			});
			throw redirect(303, "/home");
		}

		return fail(400, {
			display_name: { value: user.data.display_name },
			password: { issue: "Incorrect password." }
		});
	}
};

function create_user_jwt(payload: JWTPayloadState) {
	return sign(payload, ACCESS_TOKEN, { expiresIn: "3d" });
}

function is_correct_password(password: string, encrypted_password: string) {
	return use_await(() => compare(password, encrypted_password));
}

function set_auth_cookie(
	cookies: Cookies,
	payload: { id: string; display_name: string; name: string }
) {
	const token = create_user_jwt(payload);
	cookies.set(AUTH_COOKIE, token, { maxAge: 60 * 60 * 24 * 3, httpOnly: true, path: "/" });
}
