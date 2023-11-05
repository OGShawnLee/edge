<script>
	import { Toast, ToastGroup } from "malachite-ui";
	import { slide } from "svelte/transition";
	import { toast } from "$lib/state";
</script>

<ToastGroup
	class="fixed bottom-6 z-10 right-1/2 translate-x-1/2 w-xs md:(bottom-6 w-md) | grid gap-12px"
	{toast}
>
	{#each $toast as { id, message, type } (id)}
		<div transition:slide={{ duration: 150 }}>
			<Toast
				class="h-48px px-22px py-12px | flex items-center justify-between | {toast.getToastTypeClassName(
					type
				)} shadow-xl rounded-8px"
				{id}
				let:close
			>
				<p class="text-center text-12px md:(text-left text-14px)">{message}</p>
				<button
					class="h-32px px-4 | hidden md:block | border-2 border-top-color/10 hover:bg-top-color/20 rounded-8px bg-transparent text-sm"
					on:click={close}
				>
					Close
				</button>
			</Toast>
		</div>
	{/each}
</ToastGroup>

<div
  class="w-full min-h-screen max-w-4xl mx-auto | flex flex-col items-center | sm:(justify-center pt-8 px-4 pb-4)"
>
  <slot />
</div>

<!-- <div class="max-w-4xl h-screen mx-auto | flex items-center justify-center">
  <main class="w-full max-w-lg py-8 bg-dialog-color rounded-lg">
    <slot />
  </main>
</div> -->
