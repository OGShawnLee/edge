import { writable } from "svelte/store";

type Result<Data, Error> = { failed: false; data: Data } | { failed: true; error: Error };

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

interface ToastItem {
	id: number;
	message: string;
	type: "error" | "success" | "info";
}

export function use_toast(delay: number) {
	const queue = writable<ToastItem[]>([]);

	function push(this: void, toast: Omit<ToastItem, "id">) {
		queue.update((items) => {
			items.push({ id: Date.now(), ...toast });
			return items;
		});
	}

	function remove(id: number) {
		queue.update((items) => {
			return items.filter((item) => item.id !== id);
		});
	}

	function create_toast_item(id: number) {
		function mount() {
			const timeout = setTimeout(() => remove(id), delay);
			return {
				destroy() {
					clearTimeout(timeout);
				}
			};
		}

		function close() {
			remove(id);
		}

		return { mount, close };
	}

	return { subscribe: queue.subscribe, push, create_toast_item };
}
