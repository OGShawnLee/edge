<script>
  import "virtual:uno.css";
  import "@unocss/reset/tailwind-compat.css";
</script>

<slot />

<style>
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
