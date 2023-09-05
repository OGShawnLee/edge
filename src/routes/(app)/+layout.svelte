<script>
	import TopHeader from './TopHeader.svelte'
	import { Separator, Sidebar } from "$lib/components";

	export let data;
</script>

<div class="flex flex-col gap-24px">
	<TopHeader />
	<div class="relative max-w-6xl w-full min-h-screen mx-auto | flex gap-32px">
		<Sidebar user={data.user} />
		<Separator orientation="vertical" />
		<main class="flex flex-col flex-[600px]">
			<slot />
		</main>
		<Separator orientation="vertical" />
		<aside class="pt-4 | flex-[300px]" />
	</div>
</div>
