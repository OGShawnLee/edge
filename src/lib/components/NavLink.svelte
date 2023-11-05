<script lang="ts" context="module">
	import { page } from "$app/stores";
	import { derived } from "svelte/store";

	function use_active_link(base_path: string, href: string) {
		const is_base_path = href === "/";
		return {
			is_active: derived(page, ({ url }) => {
				if (is_base_path) return url.pathname === base_path;
				return url.pathname.endsWith(href);
			}),
			full_href: is_base_path ? base_path : base_path + href
		};
	}
</script>

<script lang="ts">
	import type { SvelteComponent } from "svelte";
	import { nav_context } from "$lib/context";
	import { isNullish, isWhitespace } from "malachite-ui/predicate";

	const context = nav_context.getContext();

	export let href: string;
	export let icon: typeof SvelteComponent | undefined = undefined;
	export let label = "";
	export let text: string;

	if ($context.type === "mobile-nav" && (isNullish(icon) || isWhitespace(label)))
		throw new Error("icon and label are required for mobile-nav type");

	$: ({ full_href, is_active } = use_active_link($context.base_path, href));
</script>

{#if $context.type === "mobile-nav"}
	<a
		class="w-full h-16 | flex flex-col items-center justify-center gap-1.25 {$is_active
			? 'font-medium text-top-color'
			: 'text-screen-name-color'}"
		{href}
		aria-label={label}
	>
		<!-- useful for notification badge -->
		<div class="relative">
			<svelte:component this={icon} size={26} />
			<slot />
		</div>
		<p class="text-9px">{text}</p>
	</a>
{:else if $context.type === "tab"}
	<a class="w-full h-full | transition-200 hover:bg-separator-horizontal" href={full_href}>
		<div class="relative w-full h-full | flex items-center justify-center">
			<span class={$is_active ? "font-medium text-top-color" : "text-screen-name-color"}>
				{text}
			</span>
			<div
				class="absolute bottom-0 left-1/2 w-1/3 h-3px | bg-top-color transform transition-200 -translate-x-1/2 {$is_active
					? 'scale-x-100'
					: 'scale-x-0'}"
			></div>
		</div>
	</a>
{/if}
