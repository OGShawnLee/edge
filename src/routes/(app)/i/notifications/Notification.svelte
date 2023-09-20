<script lang="ts">
	import type { Notification } from "@types";
	import { Heart } from "lucide-svelte";
	import { Separator, Time } from "$lib/components";

	export let index: number;
	export let length: number;
	export let notification: Notification;
</script>

<article class="grid gap-22px">
	<div class="px-6 | grid gap-6px">
		<div class="w-full | flex items-center gap-8px">
			<Heart class="text-top-color" />
			<p>
				<a class="text-top-color font-medium" href="/{notification.sender.display_name}">
					{notification.sender.name}
				</a>
				liked your post
			</p>
			<Time created_at={notification.created_at} />
		</div>
		<h3 class="text-14px text-screen-name-color">
			{notification.post.text}
		</h3>
	</div>
	{#if index != length - 1}
		<Separator orientation="horizontal" />
	{/if}
</article>
