<script>
	import { Aside, Separator, Sidebar, TopHeader } from "$lib/components";
</script>

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
