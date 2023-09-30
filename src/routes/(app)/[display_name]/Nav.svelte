<script lang="ts">
	import NavLink from "./NavLink.svelte";
	import { Separator } from "$lib/components";
	import { found_user_context } from "$lib/context";

	const found_user = found_user_context.getContext();
</script>

{#if $found_user.count_post || $found_user.count_favourite || $found_user.count_highlight > 0}
	<nav class="h-48px | flex items-center justify-around">
		{#if $found_user.count_post}
			<NavLink href="/" text="Posts" />
		{/if}
		{#if $found_user.count_favourite}
			<NavLink href="/likes" text="Likes" />
		{/if}
		{#if $found_user.count_highlight > 0}
			<NavLink href="/highlights" text="Highlights" />
		{/if}
	</nav>
	<Separator orientation="horizontal" />
{:else}
	<p class="mt-32px | text-center text-datetime-color">
		We appear to be the only ones here, partner.
	</p>
{/if}
