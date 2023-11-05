<script setup lang="ts">
	import type { Maybe } from "malachite-ui/types";
	import Separator from "./Separator.svelte";
	import { move_on_scroll_down } from "$lib/actions";

	export let display_name: Maybe<string> = undefined;
	export let title: string;
</script>

	<div
		class="sticky top-0 inset-x-0 xl:top-88px z-10"
		id="header"
		use:move_on_scroll_down={{ offset: 36 }}
	>
		<div
			class="absolute bottom-full w-full h-6 | bg-background-color/90 backdrop-filter backdrop-blur-sm"
		/>
		<header class="h-80px bg-background-color/90 backdrop-filter backdrop-blur-sm xl:h-64px">
			<div class="h-full px-6 | flex items-center justify-between">
				<div class="flex items-center gap-16px">
					<slot name="left" />
					<div class="leading-5">
						<h1 class="text-top-color text-20px font-semibold">{title}</h1>
						{#if display_name}
							<span class="text-14px text-screen-name-color"> @{display_name} </span>
						{/if}
					</div>
				</div>
				<slot />
			</div>
		</header>
		<Separator orientation="horizontal" />
	</div>
