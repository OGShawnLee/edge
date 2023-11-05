<script lang="ts">
	import NavLink from "./NavLink.svelte";
	import Separator from "./Separator.svelte";
	import { nav_context } from "$lib/context";
	import { writable } from "svelte/store";
	import { move_on_scroll_down } from "$lib/actions";

	export let base_path: string;
	export let mobile_position: "static" | "sticky" = "sticky";
	export let type: "mobile-nav" | "tab";

	const nav = nav_context.setContext(writable({ base_path, type }));

	$: $nav.base_path = base_path;
	$: $nav.type = type;
</script>

{#if type === "mobile-nav"}
	<!-- add a wrapper that has the same nav classnames -->
	<div class="fixed inset-x-0 bottom-0 backdrop--background-color xl:hidden"
		use:move_on_scroll_down={{
			offset: 36,
			position: "bottom",
			translate_class_name: "translate-y-16"
		}}
	>
		<Separator orientation="horizontal" />
		<nav class="h-16 px-22px | flex items-center justify-between">
			<slot {NavLink} />
		</nav>
	</div>
	<!-- <nav class="fixed inset-x-0 bottom-0 h-16 backdrop--background-color xl:hidden"
		use:move_on_scroll_down={{
			offset: 36,
			position: "bottom",
			translate_class_name: "translate-y-16"
		}}
	>
		<div class="h-full px-22px | flex items-center justify-between">
			<slot {NavLink} />
		</div>
	</nav> -->
{:else if type === "tab"}
	<div
		class="{mobile_position} top-84px inset-x-0 sm:static backdrop backdrop--background-color"
		id="tab"
		use:move_on_scroll_down={{
			offset: 36,
			static: mobile_position === "static",
			// 48px (nav-h) + 4px (nav-separator-h) + 84px (header-h) + 4px (nav-link-active-indicator) 
			translate_class_name: "-translate-y-134px"
		}}
	>
		<nav class="h-48px | flex items-center justify-around" id="nav-tab">
			<slot {NavLink} />
		</nav>
		<Separator orientation="horizontal" />
	</div>
{/if}
