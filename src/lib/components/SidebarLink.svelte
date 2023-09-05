<script lang="ts">
	import type { SvelteComponent } from "svelte";
	import { page } from "$app/stores";

	export let as: "a" | "button" = "a";
	export let href: string | undefined = undefined;
	export let text: string;
	export let icon: typeof SvelteComponent;

	$: is_active = href ? $page.url.pathname.includes(href) : false;
</script>

<svelte:element
	this={as}
	class="flex items-center gap-4 | {is_active ? "text-top-color" : "text-inactive-sidebar-link"} | cursor-pointer"
	{href}
	role="link"
	tabindex="0"
	on:click
>
	<svelte:component this={icon}  />
	<span class="text-20px font-semibold"> {text} </span>
</svelte:element>
