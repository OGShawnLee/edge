<script lang="ts">
	import Button from "./Button.svelte";
	import type { SvelteComponent } from "svelte";
	import { createEventDispatcher } from "svelte";
	import { deserialize } from "$app/forms";

	export let action: string;
	export let count: number;
	export let icon: typeof SvelteComponent;
	export let id: string;
	export let title: string;

	const dispatch = createEventDispatcher<{ delete: string }>();

	async function handle_submit(this: HTMLFormElement) {
		const response = await fetch(this.action, {
			body: new FormData(this),
			method: this.method
		});
		const result = deserialize(await response.text());

		if (result.type !== "success") return;


		if (result.data?.operation === "deleted") {
			count--;
			dispatch("delete", id);
		} else if (result.data?.operation === "created") {
			count++;
		}
	}
</script>

<form {action} method="post" on:submit|preventDefault={handle_submit}>
	<input type="hidden" name="id" value={id} />
	<Button
		class="flex items-center gap-1.25 | bg-transparent text-datetime-color"
		{title}
		type="submit"
	>
		<svelte:component this={icon} />
		{count}
	</Button>
</form>
