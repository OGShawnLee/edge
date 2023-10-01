<script lang="ts">
	import NavLink from "./NavLink.svelte";
	import Separator from "./Separator.svelte";
	import { nav_context } from "$lib/context";
	import { writable } from "svelte/store";

	export let base_path: string;

	const nav = nav_context.setContext(writable(base_path));

	$: nav.set(base_path);
</script>

<nav class="h-48px | flex items-center justify-around">
	<slot {NavLink} />
</nav>
<Separator orientation="horizontal" />
