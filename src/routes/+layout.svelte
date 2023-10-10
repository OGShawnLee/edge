<script>
  import "virtual:uno.css";
  import "@unocss/reset/tailwind-compat.css";
	import { pinned_post_id } from "$lib/state";

	export let data;

	$: pinned_post_id.set(data.pinned_post_id);
</script>

<slot />

<style>
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

  :global(body) {
    @apply h-screen bg-background-color text-default-text-color font-poppins;
  }

	:global(::-webkit-scrollbar) {
		width: 0.75vw;
		min-width: 0.5rem;
		@apply bg-bottom-color;
	}

	:global(::-webkit-scrollbar-thumb) {
		@apply bg-separator-vertical;
	}

	:global(::-webkit-scrollbar-thumb:hover) {
		@apply bg-datetime-color;
	}
</style>
