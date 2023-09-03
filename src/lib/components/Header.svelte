<script setup lang="ts">
	import type { Maybe } from "malachite-ui/types";

	export let display_name: Maybe<string> = undefined;
	export let title: string;
</script>

<header class="h-20 border-b-2 border-zinc-800">
	<div class="h-full px-8 | flex items-center justify-between">
		<div>
			<h1 class="text-white text-2xl font-bold">{title}</h1>
			{#if display_name}
				<div class="flex items-baseline justify-between gap-3">
					<span class="text-sm text-zinc-500"> @{display_name} </span>
				</div>
			{/if}
		</div>
		<slot name="button" />
	</div>
</header>
