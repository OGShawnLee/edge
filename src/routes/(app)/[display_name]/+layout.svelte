<script>
  import DialogEditProfile from "./DialogEditProfile.svelte";
  import Nav from './Nav.svelte'
	import UserInfo from "./UserInfo.svelte";
	import { Header } from "$lib/components";
	import { found_user_context } from "$lib/context";
	import { writable } from "svelte/store";

	export let data;

	const found_user = found_user_context.setContext(writable(data.found_user));

	let open = false;

	function open_edit_dialog() {
		open = true;
	}

	$: is_current_user = data.user?.id === data.found_user.id;
	$: found_user.set(data.found_user);
</script>

<svelte:head>
	<title>{data.found_user.name} @({data.found_user.display_name}) - Edge</title>
</svelte:head>

<DialogEditProfile bind:open />
<Header title={data.found_user.name} display_name={data.found_user.display_name}>
	{#if is_current_user}
		<button class="button button--border" on:click={open_edit_dialog}> Edit Profile </button>
	{/if}
</Header>
<UserInfo />
<Nav />
<slot />
