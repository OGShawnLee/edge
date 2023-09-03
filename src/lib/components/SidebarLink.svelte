<script lang="ts">
	import type { SvelteComponent } from "svelte";
	import { page } from "$app/stores";

	export let as: "a" | "button" = "a";
	export let href: string | undefined = undefined;
	export let text: string;
	export let icon: typeof SvelteComponent;

	$: isActive = href ? $page.url.pathname.includes(href) : false;
</script>

<svelte:element
	this={as}
	class="h-6 | flex items-center gap-3 | cursor-pointer"
	{href}
	role="link"
	tabindex="0"
	on:click
>
	<svelte:component this={icon} class={isActive ? "stroke-white" : "stroke-zinc-300"} />
	<span
		class="{isActive ? 'text-white' : 'text-zinc-300'} hidden xl:inline"
		class:text-lg={isActive}
		class:font-bold={isActive}
	>
		{text}
	</span>
</svelte:element>
