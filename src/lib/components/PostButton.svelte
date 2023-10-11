<script lang="ts">
	import Button from "./Button.svelte";
	import type { Maybe } from "malachite-ui/types";
	import type { SvelteComponent } from "svelte";
	import { createEventDispatcher } from "svelte";
	import { deserialize } from "$app/forms";
	import { isNumber } from "malachite-ui/predicate";

	export let action: string;
	export let count: Maybe<number> = undefined;
	export let icon: typeof SvelteComponent;
	export let id: string;
	export let is_active_icon = false;
	export let title: string;

	const dispatch = createEventDispatcher<{ 
		submit: "created" | "deleted" | "error"
	}>();

	async function handle_submit(this: HTMLFormElement) {
		const response = await fetch(this.action, {
			body: new FormData(this),
			method: this.method
		});
		const result = deserialize(await response.text());

		if (result.type !== "success") return dispatch("submit", "error");

		if (result.data?.operation === "deleted") {
			dispatch("submit", "deleted");
			if (isNumber(count)) count--;
			is_active_icon = false;
		} else if (result.data?.operation === "created") {
			dispatch("submit", "created");
			if (isNumber(count)) count++;
			is_active_icon = true;
		}
	}
</script>

<form {action} method="post" on:submit|preventDefault={handle_submit}>
	<input type="hidden" name="id" value={id} />
	<Button
		class="flex items-center gap-8px | bg-transparent {is_active_icon
			? 'text-default-text-color'
			: 'text-datetime-color'}"
		{title}
		type="submit"
	>
		<svelte:component this={icon} />
		{#if isNumber(count)}
			{count}
		{/if}
	</Button>
</form>
