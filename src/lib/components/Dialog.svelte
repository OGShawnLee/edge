<script lang="ts" context="module">
	function hide_scrollbar() {
		const initial_overflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return {
			destroy: () => {
				document.body.style.overflow = initial_overflow;
			}
		};
	}
</script>

<script lang="ts">
	import { fade, scale } from "svelte/transition";
	import { Dialog } from "malachite-ui";

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
		class="z-10 | w-lg pb-6 bg-dialog-color rounded-lg overflow-hidden"
		use:hide_scrollbar
		use:content
		transition:scale|global={{ duration: 200, start: 1.15 }}
	>
		<slot {close} />
	</div>
</Dialog>
