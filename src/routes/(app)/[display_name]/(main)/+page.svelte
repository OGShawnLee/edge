<script>
	import { Feed, Post } from "$lib/components";

	export let data;
</script>

<Feed title="{data.found_user.display_name}'s Posts">
	{#each data.posts as post, index (post.id)}
		<Post {post} user={data.found_user} {index} length={data.posts.length} />
	{/each}
</Feed>
