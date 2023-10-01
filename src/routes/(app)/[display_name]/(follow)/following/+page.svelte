<script>
	import { Feed, Separator } from "$lib/components";

	export let data;
</script>

<svelte:head>
	<title>People followed by {data.found_user.name} @(data.found_user.display_name)</title>
</svelte:head>

<Feed title="People followed by {data.found_user.name}">
	{#each data.following as { id, followed }, index (id)}
		<a class="grid gap-22px" href="/{followed.display_name}">
			<div class="px-24px">
				<div class="w-full mb-8px | flex items-baseline">
					<p class="text-top-color font-medium">{followed.name}</p>
					<p class="ml-12px | text-14px text-screen-name-color">
						@{followed.display_name}
					</p>
				</div>
				<p>{followed.description}</p>
			</div>
			{#if index !== data.following.length - 1}
				<Separator orientation="horizontal" />
			{/if}
		</a>
	{/each}
</Feed>
