<script>
	import { Feed, Post } from "$lib/components";
	import { pinned_post } from "$lib/state";
	import { slide } from "svelte/transition";

	export let data;

	$: pinned_post.set(data.found_user.pinned_post);
</script>

<Feed title="{data.found_user.display_name}'s Posts">
	{#if $pinned_post}
		<div transition:slide={{ duration: 150 }}>
			<Post post={$pinned_post} user={data.found_user} pinned />
		</div>
	{/if}
	{#each data.posts as post, index (post.id)}
		<Post {post} user={data.found_user} {index} length={data.posts.length} />
	{/each}
</Feed>
