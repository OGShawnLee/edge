<script lang="ts" context="module">
  function hide_scrollbar() {
    const initial_overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden"
    return {
      destroy: () => {
        document.body.style.overflow = initial_overflow
      }
    }
  }
</script>

<script lang="ts">
	import { Dialog, DialogContent, DialogOverlay } from "malachite-ui";

	let initialFocus: HTMLElement | undefined = undefined;
	
	export { initialFocus as initial_focus };
  export let open = false;
</script>

<Dialog class="fixed inset-0 z-20 | grid place-content-center" {initialFocus} bind:open>
	<DialogOverlay class="backdrop" />
	<DialogContent
		class="z-10 | w-lg pb-6 bg-dialog-color rounded-lg overflow-hidden"
		use={[hide_scrollbar]}
		let:close
	>
		<slot {close} />
	</DialogContent>
</Dialog>