<script lang="ts">
	import type { SvelteComponent } from "svelte";
	import { page } from "$app/stores";

	export let as: "a" | "button" | "form" = "a";
	export let href: string | undefined = undefined;
	export let text: string;
	export let icon: typeof SvelteComponent;

	function get_is_active(href: string | undefined, pathname: string) {
		if (href == "/") return pathname == href;
		return href ? pathname.includes(href) : false;
	}

	$: is_active = get_is_active(href, $page.url.pathname);
</script>

{#if as === "form"}
	<form action={href} method="post">
		<svelte:self as="button" {href} {icon} {text}/>
	</form>
{:else}
<svelte:element
	this={as}
	class="flex items-center gap-4 | bg-transparent {is_active ? "text-top-color" : "text-inactive-sidebar-link"} | cursor-pointer"
	{href}
	role="link"
	tabindex="0"
	on:click
>
	<svelte:component this={icon}  />
	<span class="text-20px font-semibold"> {text} </span>
</svelte:element>
{/if}

