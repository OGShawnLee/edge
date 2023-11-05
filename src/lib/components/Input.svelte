<script lang="ts">
	import type { SvelteComponent } from "svelte";
	import type { Maybe, Nullable } from "malachite-ui/types";
	import CharCount from "./CharCount.svelte";
	import TextArea from "./TextArea.svelte";

	export let error: Maybe<FormItemError> = undefined;
	export let id: string;
	export let name = id;
	export let label = id;
	export let maxlength: Maybe<number> = undefined;
	export let minlength: Maybe<number> = undefined;
	export let icon: Maybe<typeof SvelteComponent> = undefined;
	export let required = true;
	export let type = "text";
	export let placeholder: Nullable<string> = undefined;
	export let value: Nullable<string> = error?.value ?? "";

	let initial_issue = error?.issue;
	let invalid_value = error?.value;

	$: char_count = value?.length ?? 0;

	function handle_input(this: HTMLInputElement | HTMLTextAreaElement) {
		value = this.value;

		if (error) {
			if (value !== invalid_value) error.issue = undefined;
			else error.issue = initial_issue;
		}
	}
</script>

<div class="group grid gap-1.25">
	<div class="flex items-center justify-between">
		<label class="text-top-color capitalize" for={name}>{label}</label>
		<CharCount {char_count} {maxlength} {minlength} />
	</div>
	<div
		class="min-h-12 | flex | bg-input-color rounded-8px overflow-hidden focus-within:(ring-2 ring-white)"
	>
		{#if icon}
			<div class="w-12 min-w-12 h-12 | grid place-content-center | bg-input-icon-box-color">
				<svelte:component this={icon} class="group-focus-within:stroke-white" />
			</div>
		{/if}
		{#if type === "textarea"}
			<TextArea
				class="w-full py-2.5 px-4 | bg-input-color"
				{id}
				{label}
				{placeholder}
				{name}
				{required}
				{minlength}
				{maxlength}
				bind:value
				bind:char_count
			/>
		{:else}
			<input
				class="w-full py-2.5 px-4 | bg-transparent outline-none placeholder-zinc-400 focus:text-white"
				{type}
				{name}
				{id}
				{placeholder}
				{value}
				{required}
				on:input={handle_input}
			/>
		{/if}
	</div>
	{#if error?.issue}
		<div class="flex items-center gap-1.5 | text-rose-400" transition:slide={{ duration: 150 }}>
			<span class="text-xs"> {error.issue} </span>
		</div>
	{/if}
</div>
