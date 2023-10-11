<script lang="ts">
	import DialogEditProfile from "./DialogEditProfile.svelte";
	import Nav from "./Nav.svelte";
	import UserInfo from "./UserInfo.svelte";
	import { Header } from "$lib/components";
	import { found_user_context } from "$lib/context";
	import { writable } from "svelte/store";
	import { deserialize } from "$app/forms";
	import { toast } from "$lib/state";

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
	{:else if data.user}
		<form
			action="/{data.found_user.display_name}?/follow"
			method="POST"
			on:submit|preventDefault={async (event) => {
				const form = event.currentTarget;
				const response = await fetch(form.action, {
					body: new FormData(form),
					method: form.method
				});
				const result = deserialize(await response.text());

				if (result.type !== "success") {
					return toast.push({
						message: "Unable to follow user.",
						type: "error"
					});
				};

				if (result.data?.operation === "deleted") {
					data.found_user.is_followed = false;
					$found_user.count_follower--;
					toast.push({
						message: "You no longer follow " + data.found_user.name + ".",
						type: "success"
					});
				} else if (result.data?.operation === "created") {
					data.found_user.is_followed = true;
					$found_user.count_follower++;
					toast.push({
						message: "You now follow " + data.found_user.name + ".",
						type: "success"
					});
				}
			}}
		>
			<input type="hidden" name="id" value={data.found_user.id} />
			{#if data.found_user.is_followed}
				<button class="button button--border"> Unfollow </button>
			{:else}
				<button class="button button--border"> Follow </button>
			{/if}
		</form>
	{/if}
</Header>
<UserInfo />
<Nav />
<slot />