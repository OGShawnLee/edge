<script lang="ts">
	import type { User } from "@types";
	import Time from "./Time.svelte";

	export let user: User;
	export let created_at: Date | undefined = undefined;
	export let is_post_page = false;
	export let no_link = false;
</script>

<div class="flex items-end lg:items-baseline" class:pb-12px={is_post_page}>
	<div class="flex gap-y-0 gap-x-12px leading-5">
		<p class="text-top-color font-medium text-truncate">{user.name}</p>
		{#if no_link}
			<span class="block | text-14px text-screen-name-color text-truncate">
				@{user.display_name}
			</span>
		{:else}
			<a class="block | text-14px text-screen-name-color text-truncate" href="/{user.display_name}">
				@{user.display_name}
			</a>
		{/if}
	</div>
	{#if created_at}
		<Time {created_at} type="post" />
	{/if}
</div>
