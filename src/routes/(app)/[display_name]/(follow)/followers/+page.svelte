<script>
	import CardUser from "../CardUser.svelte";
	import { Feed } from "$lib/components";

	export let data;
</script>

<svelte:head>
	<title>People following {data.found_user.name} @(data.found_user.display_name)</title>
</svelte:head>

<Feed title="People following {data.found_user.name}">
	{#each data.followers as { id, follower }, index (id)}
		<CardUser user={follower} {index} length={data.followers.length} />
	{/each}
</Feed>
