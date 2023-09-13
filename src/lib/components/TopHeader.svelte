<script>
	import TextArea from './TextArea.svelte'
	import { Sun } from "lucide-svelte";
	import { user } from '$lib/state'
</script>

<!-- central-content-layout-x-gap -> 32px -->
<!-- central-content-x-marging -> 24px -->
<!-- sidebar-length = 300px -->
<!-- logo-length = layout-x-gap + central-content-x-marging = 356px -->
<!-- we use that length to push the text-area to the middle of the page x-axis  -->

<div class="sticky top-0 z-10 h-64px | bg-black">
  <div class="max-w-6xl w-full h-full mx-auto | flex items-center gap-32px">
    <!-- logo-length applied here as min-w-300px -->
		<span class="min-w-356px | uppercase text-top-color text-24px font-bold tracking-1">
			Edge | X
		</span>
		{#if $user}
			<TextArea
				class="absolute-center w-504px px-16px | bg-background-color rounded-md"
				id="post"
				placeholder="What is happening"
			/>
		{/if}
    <button class="ml-auto | bg-transparent" title="Change Color Theme">
      <Sun />
    </button>
	</div>
</div>

<style>
	:global(.text-area-width) {
		width: calc(600px - 54px - 54px);
	}
</style>
