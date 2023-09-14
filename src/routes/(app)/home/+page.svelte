<script>
	import { Feed, Header, Post } from "$lib/components";

	export let data;
</script>

<svelte:head>
	<title>Home - Edge</title>
</svelte:head>

<Header title="Home" />
<Feed>
	{#each data.feed as { id, created_at, text, user }, index (id)}
		<Post {created_at} {user} {text} {index} length={data.feed.length} />
	{/each}
</Feed>
