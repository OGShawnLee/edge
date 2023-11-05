<script>
	import { Feed, Header, Post, ToggleSidebar } from "$lib/components";
	import { bookmark_route_context } from "$lib/context";
	import { slide } from 'svelte/transition'

	export let data;

	bookmark_route_context.setContext((post_id) => {
		data.bookmarks = data.bookmarks.filter(bookmark => bookmark.post.id !== post_id)
	})
</script>

<svelte:head>
	<title>Bookmarks - Edge</title>
</svelte:head>

<Header title="Bookmarks" display_name={data.user.display_name} >
	<ToggleSidebar slot="left" />
</Header>
<Feed title="Bookmarks">
	{#each data.bookmarks as { id, post }, index (id)}
		<div transition:slide>
			<Post {post} user={post.user} {index} length={data.bookmarks.length} />
		</div>
	{/each}
</Feed>
