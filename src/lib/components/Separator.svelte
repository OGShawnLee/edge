<script lang="ts">
	export let orientation: "horizontal" | "vertical";
  export let bg_lighter = false;
</script>

{#if orientation === "horizontal"}
	<div class="h-4px w-full | {bg_lighter ? 'bg-input-color' : 'bg-separator-horizontal'} rounded-md" role="separator" aria-orientation={orientation} />
{:else if orientation === "vertical"}
	<div class="hidden sticky h-full top-88px w-4px | bg-separator-vertical rounded-md xl:block" role="separator" aria-orientation={orientation} />
{/if}

<style>
  /* top-header-height -> 64px + container-gap -> 28px = 88px */
  /* additional -24px to copy separator - top-header gap */
  div[aria-orientation="vertical"] {
    min-height: calc(100vh - 64px - 24px - 24px )
  }
</style>
