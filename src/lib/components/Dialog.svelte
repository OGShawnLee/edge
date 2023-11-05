<script lang="ts">
	import { Dialog } from "malachite-ui";
	import { fade, scale } from "svelte/transition";
	import { hide_scrollbar } from '$lib/actions'

	let initialFocus: HTMLElement | undefined = undefined;

	export { initialFocus as initial_focus };
	export let open = false;
</script>

<Dialog
	class="fixed inset-0 z-20 | grid place-content-center"
	{initialFocus}
	bind:open
	let:content
	let:close
	let:overlay
>
	<div class="backdrop" use:overlay transition:fade|global={{ duration: 200 }} />
	<div
		class="w-full h-full pb-6 z-10 | bg-dialog-color rounded-lg overflow-hidden md:w-lg"
		use:hide_scrollbar
		use:content
		transition:scale|global={{ duration: 200, start: 1.15 }}
	>
		<slot {close} />
	</div>
</Dialog>
