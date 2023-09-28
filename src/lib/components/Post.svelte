<script lang="ts">
	import type { Post, User } from "@types";
	import Separator from "./Separator.svelte";
	import PostButton from "./PostButton.svelte";
	import Time from "./Time.svelte";
	import { Bookmark, Heart, Repeat, Sparkles } from "lucide-svelte";
	import { bookmark_route_context } from "$lib/context";

	export let index: number;
	export let length: number;
	export let post: Post;
	export let user: User;

	const on_bookmark_deleted = bookmark_route_context.getContext(false);
</script>

{#if post.repost_of}
	<svelte:self {index} {length} post={post.repost_of} user={post.repost_of.user}>
		<div class="flex items-center gap-8px | text-screen-name-color">
			<Repeat size="14" />
			<p class="text-14px">
				<a class="font-medium" href="/{user.display_name}">
					{user.name}
				</a>
				reposted
			</p>
		</div>
	</svelte:self>
{:else}
	<article class="grid gap-22px">
		<div class="px-24px | grid gap-12px">
			<slot />
			<div>
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
					<PostButton
						action="/home?/repost"
						title="Repost"
						icon={Repeat}
						is_active_icon={post.is_reposted}
						id={post.id}
						count={post.count_repost}
					/>
					<PostButton
						action="/home?/highlight"
						title="Highlight or Unhighlight Post"
						icon={Sparkles}
						is_active_icon={post.is_highlighted}
						id={post.id}
					/>
				</div>
			</div>
		</div>
		{#if index != length - 1}
			<Separator orientation="horizontal" />
		{/if}
	</article>
{/if}
