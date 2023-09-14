<script>
	import { Header, Post } from "$lib/components";

	export let data;
</script>

<svelte:head>
	<title>Home - Edge</title>
</svelte:head>

<Header title="Home" />
<section class="py-6 | grid gap-6">
	<h2 class="sr-only"> Feed </h2>
	{#each data.feed as { id, created_at, text, user }, index (id)}
		<Post {created_at} {user} {text} {index} length={data.feed.length} />
	{/each}
</section>
