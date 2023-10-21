<script lang="ts" context="module">
	import type { Action } from "svelte/action";

	const use_observer_once: Action<HTMLElement, (element: HTMLElement) => void> = (
		element,
		on_intersect
	) => {
		if (element.dataset.notSeen === "false") return;

		const observer = new IntersectionObserver((entries) => {
			if (entries[0].isIntersecting) {
				on_intersect(element);
				observer.disconnect();
			}
		});
		observer.observe(element);
		
		return {
			destroy() {
				observer.disconnect();
			}
		};
	};

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
	export let seen_notifications: Notification["id"][];

	const { text, icon } = get_notification_event_icon_n_text(notification.event);
</script>

<article
	class="relative | grid gap-22px"
	data-not-seen={notification.is_unseen}
	use:use_observer_once={() => {
		if (notification.is_unseen) {
			seen_notifications.push(notification.id);
		}
	}}
>
	<div class="px-6 | grid gap-6px">
		{#if notification.is_unseen}
			<div class="absolute top-0 right-0 | flex items-center gap-4px">
				<div class="w-8px h-8px | rounded-full | bg-red-500" />
				<p class="text-12px text-top-color">New</p>
			</div>
		{/if}
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
			<h3 class="text-14px text-screen-name-color whitespace-pre-line">
				{notification.post.text}
			</h3>
		{/if}
	</div>
	{#if index != length - 1}
		<Separator orientation="horizontal" />
	{/if}
</article>
