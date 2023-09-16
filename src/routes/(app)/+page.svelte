<script>
	import { Feed, Header, Post } from "$lib/components";

	export let data;
</script>

<svelte:head>
	<title>Edge</title>
</svelte:head>

<Header title="Edge" />
<Feed>
	{#each data.feed as post, index (post.id)}
		<Post {post} user={post.user} {index} length={data.feed.length} />
	{/each}
</Feed>
