<script>
	import { Feed, Separator } from "$lib/components";

	export let data;
</script>

<svelte:head>
	<title>People following {data.found_user.name} @(data.found_user.display_name)</title>
</svelte:head>

<Feed title="People following {data.found_user.name}">
	{#each data.followers as { id, follower }, index (id)}
		<a class="grid gap-22px" href="/{follower.display_name}">
			<div class="px-24px">
				<div class="w-full mb-8px | flex items-baseline">
					<p class="text-top-color font-medium">{follower.name}</p>
					<p class="ml-12px | text-14px text-screen-name-color">
						@{follower.display_name}
					</p>
				</div>
				<p>{follower.description}</p>
			</div>
			{#if index !== data.followers.length - 1}
				<Separator orientation="horizontal" />
			{/if}
		</a>
	{/each}
</Feed>
