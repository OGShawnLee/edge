import type { Post } from "@types";
import type { Nullable } from "malachite-ui/types";
import { derived, writable } from "svelte/store";
import { page } from "$app/stores";
import { useToast } from 'malachite-ui';

export const count_unseen_notifications = writable(0);
export const pinned_post_id = writable<string | undefined>();
export const pinned_post = writable<Nullable<Post>>();
export const toast = useToast(3_000, {
  error: "bg-rose-900",
  success: "bg-green-900",
  info: "bg-indigo-900",
});
export const mobile_sidebar_open = writable(false);
export const user = derived(page, page => page.data.user);