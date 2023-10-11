<script>
	import { Aside, Separator, Sidebar, Toast, TopHeader } from "$lib/components";
	import { toast } from "$lib/state";
	import { slide } from "svelte/transition";
</script>

<Toast class="fixed bottom-6 z-10 right-1/2 translate-x-1/2 w-md | grid gap-12px" let:ToastItem>
	{#each $toast as { id, message, type } (id)}
		{@const toast_bg_color = type === "error" ? "bg-rose-900" : "bg-indigo-900"}
		<div transition:slide={{ duration: 150 }}>
			<ToastItem
				class="px-22px py-12px | flex justify-between | {type === 'info'
					? 'bg-dialog-color'
					: toast_bg_color} rounded-8px"
				{id}
				let:close
			>
				<p class="text-14px">{message}</p>
				<button class="text-sm bg-transparent" on:click={close}>Close</button>
			</ToastItem>
		</div>
	{/each}
</Toast>

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
