import type { User } from "edge/interfaces";
import type { NavTypes } from "@types";
import type { Writable } from "svelte/store";
import { useContext } from "malachite-ui/hooks";
import { isFunction, isWritable } from "malachite-ui/predicate";

type FoundUser = Omit<User, "email" | "password" | "count_bookmark" | "count_repost" | "posts">;

export type OnBookmarkDeleted = (post_id: string) => void;

export const bookmark_route_context = useContext({
	component: "bookmarks",
	predicate: (context): context is OnBookmarkDeleted => isFunction(context)
});

export const found_user_context = useContext({
	component: "found-user",
	predicate: (context): context is Writable<FoundUser> => isWritable(context)
});

export const nav_context = useContext({
	component: "nav",
	predicate: (context): context is Writable<{
		base_path: string,
		type: NavTypes
	}> => isWritable(context)
});

export const toast_context = useContext({
	component: "toast",
	predicate: (
		context
	): context is (id: number) => {
		mount(): { destroy(): void };
		close(): void;
	} => isFunction(context)
});
