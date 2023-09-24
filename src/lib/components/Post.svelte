<script lang="ts">
	import type { Post, User } from "@types";
	import Separator from "./Separator.svelte";
	import PostButton from "./PostButton.svelte";
	import Time from "./Time.svelte";
	import { Bookmark, Heart } from "lucide-svelte";
	import { bookmark_route_context } from "$lib/context";

	export let index: number;
	export let length: number;
	export let post: Post;
	export let user: User;

	const on_bookmark_deleted = bookmark_route_context.getContext(false);
</script>

<article class="grid gap-22px">
	<div class="px-24px">
		<header class="w-full mb-8px | flex items-baseline">
			<p class="text-top-color font-medium">{user.name}</p>
			<a class="ml-12px | text-14px text-screen-name-color" href="/{user.display_name}">
				@{user.display_name}
			</a>
			<Time created_at={post.created_at} />
		</header>
		<h3 class="mb-16px whitespace-pre-line">{post.text}</h3>
		<div class="flex items-center gap-76px">
			<PostButton
				action="/home?/bookmark"
				title="Bookmark or Unbookmark"
				icon={Bookmark}
				is_active_icon={post.is_bookmarked}
				id={post.id}
				count={post.count_bookmark}
				on:delete={(event) => on_bookmark_deleted?.(event.detail)}
			/>
			<PostButton
				action="/home?/favourite"
				active_color="text-rose-500"
				title="Like or Unlike Post"
				icon={Heart}
				is_active_icon={post.is_favourited}
				id={post.id}
				count={post.count_favourite}
			/>
		</div>
	</div>
	{#if index != length - 1}
		<Separator orientation="horizontal" />
	{/if}
</article>
