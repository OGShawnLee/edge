<script>
	import { Feed, Post } from "$lib/components";

	export let data;
</script>

<Feed>
	{#each data.feed as post, index (post.id)}
		<Post {post} user={post.user} {index} length={data.feed.length} />
	{/each}
</Feed>
