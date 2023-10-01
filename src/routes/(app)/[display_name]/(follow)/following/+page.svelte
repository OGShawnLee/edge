<script>
	import CardUser from "../CardUser.svelte";
	import { Feed } from "$lib/components";

	export let data;
</script>

<svelte:head>
	<title>People followed by {data.found_user.name} @(data.found_user.display_name)</title>
</svelte:head>

<Feed title="People followed by {data.found_user.name}">
	{#each data.following as { id, followed }, index (id)}
	<CardUser user={followed} {index} length={data.following.length} />
	{/each}
</Feed>
