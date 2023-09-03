<script>
	import { Sidebar } from "$lib/components";

	export let data;
</script>

<div class="relative max-w-6xl min-h-screen mx-auto | flex items-start">
	<Sidebar user={data.user} />
	<main
		class="min-h-screen pl-0 pt-4 pb-8 | flex flex-col flex-[680px] flex-grow | border-r-2 border-zinc-800"
	>
		<slot />
	</main>
	<aside class="pt-4 | flex-[300px]" />
</div>
