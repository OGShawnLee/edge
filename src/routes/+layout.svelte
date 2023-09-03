<script>
  import "virtual:uno.css";
  import "@unocss/reset/tailwind-compat.css";
</script>

<slot />

<style>
  :global(body) {
    @apply h-screen bg-zinc-900 text-zinc-300 font-roboto;
  }

	:global(::-webkit-scrollbar) {
		background-color: hsl(240, 8%, 14%);
		width: 0.75vw;
		min-width: 0.5rem;
	}

	:global(::-webkit-scrollbar-thumb) {
		background-color: hsl(240, 12%, 30%);
	}

	:global(::-webkit-scrollbar-thumb:hover) {
		background-color: hsl(240, 15%, 40%);
	}
</style>
