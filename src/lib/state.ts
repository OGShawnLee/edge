import type { Post } from "@types";
import type { Nullable } from "malachite-ui/types";
import { derived, writable } from "svelte/store";
import { page } from "$app/stores";
import { use_toast } from './hooks'

export const pinned_post_id = writable<string | undefined>();
export const pinned_post = writable<Nullable<Post>>();
export const toast = use_toast(3_000);
export const user = derived(page, page => page.data.user);