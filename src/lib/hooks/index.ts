import { page } from "$app/stores";
import { derived } from "svelte/store";

type Result<Data, Error> = { failed: false; data: Data } | { failed: true; error: Error };

export function use_active_link(base_path: string, href: string) {
	const is_base_path = href === "/";
	return {
		is_active: derived(page, ({ url }) => {
			if (is_base_path) return url.pathname === base_path;
			return url.pathname.endsWith(href);
		}),
		full_href: is_base_path ? base_path : base_path + href
	};
}

export async function use_await<Data, Error>(
	fn: () => Promise<Data>
): Promise<Result<Data, Error>> {
	try {
		return { failed: false, data: await fn() };
	} catch (error) {
		return { failed: true, error: error as Error };
	}
}

export function use_catch<Data, Error>(fn: () => Data): Result<Data, Error> {
	try {
		return { failed: false, data: fn() };
	} catch (error) {
		return { failed: true, error: error as Error };
	}
}