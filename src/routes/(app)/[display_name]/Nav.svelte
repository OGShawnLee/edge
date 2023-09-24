<script lang="ts">
	import NavLink from "./NavLink.svelte";
	import { Separator } from "$lib/components";
	import { found_user_context } from "$lib/context";

	const found_user = found_user_context.getContext();
</script>

<nav class="h-48px | flex items-center justify-around">
	<NavLink href="/" text="Posts" />
	<NavLink href="/likes" text="Likes" />
	{#if $found_user.count_highlight > 0}
		<NavLink href="/highlights" text="Highlights" />
	{/if}
</nav>
<Separator orientation="horizontal" />
