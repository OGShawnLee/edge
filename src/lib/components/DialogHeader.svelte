<script lang="ts">
	import { Button } from "$lib/components";
	import { DialogTitle } from "malachite-ui";
	import { X } from "lucide-svelte";
	import type { Maybe } from "malachite-ui/types";

	export let close: () => void;
	export let title: string;
	export let prompt: Maybe<string> = undefined;
</script>

<header class="p-6 pb-4 | flex items-center gap-16px | border-b-4 border-#202020">
	<Button class="button button--square" title="Close Dialog" on:click={close}>
		<X class="stroke-top-color" />
	</Button>
	<DialogTitle class="text-xl text-white font-medium">{title}</DialogTitle>
	<slot>
		<Button class="button button--top | ml-auto" type="submit">
			{prompt}
		</Button>
	</slot>
</header>
