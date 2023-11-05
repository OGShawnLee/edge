<script>
	import { Header, Nav, ToggleSidebar } from "$lib/components";
	import { Sun } from "lucide-svelte";
	import { toast } from "$lib/state";

	export let data;
</script>

<svelte:head>
	<title>Home - Edge</title>
</svelte:head>

<Header title="Home">
	<ToggleSidebar slot="left" />
</Header>
{#if data.count_following}
	<Nav base_path="/home" type="tab" let:NavLink>
		<NavLink href="/" text="Home" />
		<NavLink href="/following" text="Following" />
	</Nav>
{/if}
<slot />
