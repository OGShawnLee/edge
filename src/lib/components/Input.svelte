<script lang="ts" context="module">
	import { isAround, isNumber } from "malachite-ui/predicate";

	function get_percentage(amount: number, max: number) {
		return (amount / max) * 100;
	}

	function get_char_count_colour(char_count: number, min: number, max: number) {
		if (isAround(char_count, { min: 0, max: min })) return "text-rose-400";
		const percentage = get_percentage(char_count, max);
		if (isAround(percentage, { min: 0, max: 50 })) return "text-lime-400";
		if (isAround(percentage, { min: 50, max: 80 })) return "text-orange-400";
		return "text-rose-400";
	}
</script>

<script lang="ts">
	import type { SvelteComponent } from "svelte";
	import type { Maybe, Nullable } from "malachite-ui/types";
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

<div class="grid gap-3">
	<div class="group grid gap-1.25">
		<div class="flex items-center justify-between">
			<label class="text-zinc-100 capitalize" for={name}>{label}</label>
			{#if isNumber(maxlength) && isNumber(minlength)}
				<div class="text-sm font-victor">
					<span class="font-medium {get_char_count_colour(char_count, minlength, maxlength)}">
						{char_count}
					</span>
					<span> / </span>
					<span class="font-bold"> {maxlength} </span>
				</div>
			{/if}
		</div>
		<div
			class="min-h-10 | flex | bg-zinc-800 rounded-lg overflow-hidden focus-within:(ring-2 ring-white)"
		>
			{#if icon}
				<div class="w-12 min-w-12 h-12 | grid place-content-center | bg-zinc-700">
					<svelte:component this={icon} class="group-focus-within:stroke-white" />
				</div>
			{/if}
			{#if type === "textarea"}
				<TextArea
					class="py-2.5 px-3"
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
					class="w-full py-2.5 px-3 | bg-transparent outline-none placeholder-zinc-400 focus:text-white"
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
			<div class="flex items-center gap-1.5 | text-rose-400">
				<span class="text-xs"> {error.issue} </span>
			</div>
		{/if}
	</div>
</div>
