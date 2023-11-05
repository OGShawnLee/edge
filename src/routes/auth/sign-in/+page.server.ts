import type { Issues } from "valibot";
import e from "edge/edgeql-js";
import { set_auth_cookie } from "$lib/server/auth";
import { user_schema } from "$lib/valibot";
import { parse, pick, flatten } from "valibot";
import { use_await, use_catch } from "$lib/hooks";
import { error, fail, redirect } from "@sveltejs/kit";
import { get_client } from "$lib/server/client";
import { compare } from "bcrypt";
import { isNullish } from "malachite-ui/predicate";

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
			return fail(500, { 
				issue: "Unable to sign in. Can't retrieve user information." 
			});
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

function is_correct_password(password: string, encrypted_password: string) {
	return use_await(() => compare(password, encrypted_password));
}

