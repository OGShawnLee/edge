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
	import type { Post, User } from "edge/interfaces";
	import Separator from "./Separator.svelte";

	export let created_at: Post["created_at"];
	export let index: number;
	export let length: number;
	export let text: Post["text"];
	export let user: Pick<User, "display_name" | "id" | "name">;
</script>

<article class="grid gap-22px">
	<div class="px-6 | grid gap-2">
		<header class="w-full | flex items-baseline">
			<p class="text-top-color font-medium">{user.name}</p>
			<a class="ml-12px | text-14px text-screen-name-color" href="/{user.display_name}">
				@{user.display_name}
			</a>
			<time class="ml-36px | text-12px text-datetime-color" datetime={created_at.toISOString()}>
				{get_relative_time(created_at)}
			</time>
		</header>
		<h3>{text}</h3>
	</div>
	{#if index != length - 1}
		<Separator orientation="horizontal" />
	{/if}
</article>
