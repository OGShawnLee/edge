<script>
	import { Feed, Post } from "$lib/components";

	export let data;
</script>

<Feed title="Posts from people you follow">
	{#each data.feed as post, index (post.id)}
		<Post {post} user={post.user} {index} length={data.feed.length} />
	{:else}
		<div class="mt-32px | grid gap-8px | text-center">
			<p class="text-datetime-color">We appear to be the only ones here, partner.</p>
			<p class="text-screen-name-color">
				Follow someone and their posts will appear here.
			</p>
		</div>
	{/each}
</Feed>
