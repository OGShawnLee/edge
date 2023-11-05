<script>
	import { Aside, Separator, Sidebar, TopHeader } from "$lib/components";
	import { ButtonComposeMobile, NavMobile } from '$lib/layout'
	import { Toast, ToastGroup } from "malachite-ui";
	import { count_unseen_notifications, toast } from "$lib/state";
	import { slide } from "svelte/transition";

	export let data;

	$: $count_unseen_notifications = data.count_unseen_notifications;
</script>

<ToastGroup
	class="fixed bottom-58px z-10 right-1/2 translate-x-1/2 w-xs md:(bottom-6 w-md) | grid gap-12px"
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

<div class="flex flex-col gap-24px">
	<TopHeader />
	<div class="relative max-w-6xl w-full mx-auto | flex gap-32px">
		<Sidebar />
		<Separator orientation="vertical" />
		<main class="w-full flex flex-col xl:flex-[600px]">
			<slot />
		</main>
		<Separator orientation="vertical" />
		<Aside />
	</div>
</div>


<ButtonComposeMobile />
<NavMobile />

<div class="hidden xl:block">
	<div class="fixed left-0 inset-y-0 w-0.65rem | bg-black" />
	<div class="fixed left-0.65rem top-64px w-64px h-64px | bg-black">
		<div class="w-full h-full | bg-background-color rounded-tl-16px" />
	</div>
	<div class="fixed right-0 top-64px w-64px h-64px | bg-black">
		<div class="w-full h-full | bg-background-color rounded-tr-16px" />
	</div>
</div>
