import type { User } from "edge/interfaces";
import type { Writable } from "svelte/store";
import { useContext } from "malachite-ui/hooks";
import { isFunction, isWritable } from "malachite-ui/predicate";

type FoundUser = Pick<
	User,
	"created_at" | "description" | "display_name" | "id" | "location" | "name" | "count_highlight"
>;

export type OnBookmarkDeleted = (post_id: string) => void;

export const bookmark_route_context = useContext({
	component: "bookmarks",
	predicate: (context): context is OnBookmarkDeleted => isFunction(context)
});

export const found_user_context = useContext({
	component: "found-user",
	predicate: (context): context is Writable<FoundUser> => isWritable(context)
});
