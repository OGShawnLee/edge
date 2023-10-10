import type { Maybe, Nullable } from "malachite-ui/types";
import { derived, writable } from "svelte/store";
import { page } from "$app/stores";
import type { Post } from "@types";

export const pinned_post_id = writable<string | undefined>();
export const pinned_post = writable<Nullable<Post>>();
export const user = derived(page, page => page.data.user);
