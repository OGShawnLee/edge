<script>
	import { Header, Nav } from "$lib/components";

	export let data;
</script>

<svelte:head>
	<title>Home - Edge</title>
</svelte:head>

<Header title="Home" />
{#if data.count_following}
	<Nav base_path="/home" let:NavLink>
		<NavLink href="/" text="Home" />
		<NavLink href="/following" text="Following" />
	</Nav>
{/if}
<slot />
