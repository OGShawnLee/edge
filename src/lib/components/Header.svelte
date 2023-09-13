<script setup lang="ts">
	import type { Maybe } from "malachite-ui/types";
	import Separator from "./Separator.svelte";

	export let display_name: Maybe<string> = undefined;
	export let title: string;
</script>

<div class="sticky top-88px z-10">
	<div class="absolute bottom-full w-full h-24px | bg-background-color/90 backdrop-filter backdrop-blur-sm" />		
	<header class="h-64px bg-background-color/90 backdrop-filter backdrop-blur-sm">
		<div class="h-full px-6 | flex items-center justify-between">
			<div class="leading-5">
				<h1 class="text-top-color text-20px font-semibold">{title}</h1>
				{#if display_name}
					<span class="text-14px text-screen-name-color"> @{display_name} </span>
				{/if}
			</div>
			<slot />
		</div>
	</header>
	<Separator orientation="horizontal" />
</div>
