import type { User } from "edge/interfaces";
import type { Writable } from "svelte/store";
import { useContext } from "malachite-ui/hooks";
import { isWritable } from "malachite-ui/predicate";

type FoundUser = Pick<
	User,
	"created_at" | "description" | "display_name" | "id" | "location" | "name"
>;

export const found_user_context = useContext({
	component: "found-user",
	predicate: (context): context is Writable<FoundUser> => isWritable(context)
});
