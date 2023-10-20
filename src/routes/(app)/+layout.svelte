<script>
	import { Aside, Separator, Sidebar, TopHeader } from "$lib/components";
	import { Toast, ToastGroup } from "malachite-ui"
	import { toast } from "$lib/state";
	import { slide } from "svelte/transition";
</script>

<ToastGroup class="fixed bottom-6 z-10 right-1/2 translate-x-1/2 w-md | grid gap-12px" {toast}>
	{#each $toast as { id, message, type } (id)}
		<div transition:slide={{ duration: 150 }}>
			<Toast
				class="px-22px py-12px | flex justify-between | {
					toast.getToastTypeClassName(type)
				} shadow-xl rounded-8px"
				{id}
				let:close
			>
				<p class="text-14px">{message}</p>
				<button class="text-sm bg-transparent" on:click={close}>Close</button>
			</Toast>
		</div>
	{/each}
</ToastGroup>

<div class="flex flex-col gap-24px">
	<TopHeader />
	<div class="relative max-w-6xl w-full mx-auto | flex gap-32px">
		<Sidebar />
		<Separator orientation="vertical" />
		<main class="flex flex-col flex-[600px]">
			<slot />
		</main>
		<Separator orientation="vertical" />
		<Aside />
	</div>
</div>
