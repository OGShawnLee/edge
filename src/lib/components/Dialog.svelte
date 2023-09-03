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
	
  export let open = false;
	export { initialFocus as initial_focus };
	export let padding = true;
	export let small = false;
</script>

<Dialog class="fixed inset-0 | grid place-content-center" {initialFocus} bind:open>
	<DialogOverlay class="fixed inset-0 | bg-zinc-1000/80 backdrop-filter backdrop-blur-sm" />
	<DialogContent
		class="z-10 {padding ? 'py-8' : 'py-0'} | w-sm {small
			? 'md:w-sm'
			: 'sm:w-lg md:w-xl'} bg-zinc-900 rounded-3xl overflow-hidden"
		use={[hide_scrollbar]}
		let:close
	>
		<slot {close} />
	</DialogContent>
</Dialog>