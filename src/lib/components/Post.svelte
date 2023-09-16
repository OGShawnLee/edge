<script lang="ts" context="module">
	// https://natclark.com/tutorials/javascript-relative-time/
	function get_relative_time(date: Date) {
		const current = new Date().getTime();
		const current_seconds = Math.floor(current / 1000);
		const old = date.getTime();
		const old_seconds = Math.floor(old / 1000);
		const difference = current_seconds - old_seconds;

		if (difference < 60) {
			return get_time_string(difference, "second");
		} else if (difference < 3600) {
			// Less than an hour has passed:
			return get_time_string(Math.floor(difference / 60), "minute");
		} else if (difference < 86400) {
			// Less than a day has passed:
			return get_time_string(Math.floor(difference / 3600), "hour");
		} else if (difference < 2620800) {
			// Less than a month has passed:
			return get_time_string(Math.floor(difference / 86400), "day");
		} else if (difference < 31449600) {
			// Less than a year has passed:
			return get_time_string(Math.floor(difference / 2620800), "month");
		} else {
			// More than a year has passed:
			return get_time_string(Math.floor(difference / 31449600), "year");
		}
	}

	function get_time_string(amount: number, word: string) {
		return `${amount} ${plural(amount, word)} ago`;
	}

	function plural(count: number, word: string) {
		return count === 1 ? word : word + "s";
	}
</script>

<script lang="ts">
	import type { Post, User } from "@types";
	import Separator from "./Separator.svelte";
	import PostButton from "./PostButton.svelte";
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
			<time
				class="ml-36px | text-12px text-datetime-color"
				datetime={post.created_at.toISOString()}
			>
				{get_relative_time(post.created_at)}
			</time>
		</header>
		<h3 class="mb-16px">{post.text}</h3>
		<div class="flex items-center gap-76px">
			<PostButton
				action="/home?/bookmark"
				title="Bookmark or Unbookmark"
				icon={Bookmark}
				id={post.id}
				count={post.count_bookmark}
				on:delete={event => on_bookmark_deleted?.(event.detail)}
			/>
			<PostButton
				action="/home?/favourite"
				title="Like or Unlike Post"
				icon={Heart}
				id={post.id}
				count={post.count_favourite}
			/>
		</div>
	</div>
	{#if index != length - 1}
		<Separator orientation="horizontal" />
	{/if}
</article>
