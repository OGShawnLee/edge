<script lang="ts" context="module">
	function get_notification_event_icon_n_text(event: Notification["event"]) {
		if (event === "favourite") return { icon: Heart, text: "liked" };
		if (event === "repost") return { icon: Repeat, text: "reposted" };
		return { icon: UserPlus, text: "followed" };
	}
</script>

<script lang="ts">
	import type { Notification } from "@types";
	import { Heart, Repeat, UserPlus } from "lucide-svelte";
	import { Separator, Time } from "$lib/components";

	export let index: number;
	export let length: number;
	export let notification: Notification;

	const { text, icon } = get_notification_event_icon_n_text(notification.event);
</script>

<article class="grid gap-22px">
	<div class="px-6 | grid gap-6px">
		<div class="w-full | flex items-center gap-8px">
			<svelte:component this={icon} class="text-top-color" />
			<p>
				<a class="text-top-color font-medium" href="/{notification.sender.display_name}">
					{notification.sender.name}
				</a>
				{text}
				{notification.post ? "your post" : "you"}
			</p>
			<Time created_at={notification.created_at} />
		</div>
		{#if notification.post}
			<h3 class="text-14px text-screen-name-color">
				{notification.post.text}
			</h3>
		{/if}
	</div>
	{#if index != length - 1}
		<Separator orientation="horizontal" />
	{/if}
</article>
