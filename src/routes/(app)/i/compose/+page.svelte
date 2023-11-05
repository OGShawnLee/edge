<script lang="ts">
	import { Button, CharCount, Header, PostUser, TextArea } from "$lib/components";
	import { deserialize } from "$app/forms";
	import { applyAction } from "$app/forms";
	import { toast } from "$lib/state.js";

	export let data;

	let char_count = 0;

	async function handle_submit(this: HTMLFormElement) {
		const response = await fetch(this.action, {
			body: new FormData(this),
			method: this.method
		});

		const result = deserialize(await response.text());

		if (result.type === "redirect") {
			return applyAction(result);
		}

		if (result.type === "error" || result.type === "failure") {
			toast.push({
				type: "error",
				message: "Something went wrong. Please try again later."
			})
		}
	}
</script>

<svelte:head>
	<title>Compose - Edge</title>
</svelte:head>

<form action="/home?/post&with-redirect" method="post" on:submit|preventDefault={handle_submit}>
	<Header title="Compose">
		<div class="ml-auto | flex items-center gap-4.5">
			<CharCount {char_count} maxlength={280} minlength={1} />
			<Button class="button button--top" type="submit">
				<span class="hidden md:block"> Post </span>
				<span class="md:hidden"> Post </span>
			</Button>
		</div>
	</Header>
	<main class="pt-6 px-24px pb-22 xl:pb-6">
		<PostUser user={data.user} is_post_page no_link />
		<TextArea
			id="post"
			label="Post"
			autofocus
			minlength={1}
			maxlength={280}
			placeholder="What is happening?"
			bind:char_count
		/>
	</main>
</form>
