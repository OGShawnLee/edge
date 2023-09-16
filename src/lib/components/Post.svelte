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
	import Button from "./Button.svelte";
	import Separator from "./Separator.svelte";
	import { Bookmark } from "lucide-svelte";
	import { deserialize } from "$app/forms";
	import { bookmark_route_context } from "$lib/context";

	export let index: number;
	export let length: number;
	export let post: Post;
	export let user: User;

	$: count_bookmark = post.count_bookmark;

	const on_bookmark_deleted = bookmark_route_context.getContext(false)

	async function handle_bookmark(this: HTMLFormElement) {
		const response = await fetch(this.action, {
			body: new FormData(this),
			method: this.method
		});
		const result = deserialize(await response.text());

		if (result.type !== "success") return;

		if (result.data?.operation === "deleted") {
			count_bookmark--;
			on_bookmark_deleted?.(post.id);
		} else {
			count_bookmark++;
		}
	}
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
			<form action="/home?/bookmark" method="post" on:submit|preventDefault={handle_bookmark}>
				<input type="hidden" name="id" value={post.id} />
				<Button
					class="flex items-center gap-1.25 | bg-transparent text-datetime-color"
					title="Bookmark or Unbookmark Post"
					type="submit"
				>
					<Bookmark />
					{count_bookmark}
				</Button>
			</form>
		</div>
	</div>
	{#if index != length - 1}
		<Separator orientation="horizontal" />
	{/if}
</article>
