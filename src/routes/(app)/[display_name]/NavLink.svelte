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
	import { found_user_context } from "$lib/context";

	const found_user = found_user_context.getContext();

	export let href: string;
	export let text: string;

	$: ({ full_href, is_active } = use_active_link("/" + $found_user.display_name, href));
</script>

<a class="w-full h-full | transition  hover:bg-separator-horizontal" href={full_href}>
	<div class="relative w-full h-full | flex items-center justify-center">
		<span class="{$is_active ? 'font-medium text-top-color' : 'text-screen-name-color'}">
			{text}
		</span>
		<div
			class="absolute top-full left-1/2 w-1/3 h-3px | bg-top-color transform transition transition-150 -translate-x-1/2 {$is_active
				? 'scale-x-100'
				: 'scale-x-0'}"
		></div>
	</div>
</a>
