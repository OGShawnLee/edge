<script lang="ts" context="module">
	import { isAround, isNumber } from "malachite-ui/predicate";

	function get_percentage(amount: number, max: number) {
		return (amount / max) * 100;
	}

	function get_char_count_colour(charCount: number, min: number, max: number) {
		if (isAround(charCount, { min: 0, max: min })) return "text-rose-400";
		const percentage = get_percentage(charCount, max);
		if (isAround(percentage, { min: 0, max: 50 })) return "text-lime-400";
		if (isAround(percentage, { min: 50, max: 80 })) return "text-orange-400";
		return "text-rose-400";
	}
</script>

<script lang="ts">
	import type { SvelteComponent } from "svelte";
	import type { Maybe } from "malachite-ui/types";

	export let error: Maybe<FormItemError> = undefined;
	export let id: string;
	export let name = id;
	export let label = id;
	export let maxlength: Maybe<number> = undefined;
	export let minlength: Maybe<number> = undefined;
	export let icon: Maybe<typeof SvelteComponent> = undefined;
	export let type = "text";
	export let placeholder: Maybe<string> = undefined;

	let initial_issue = error?.issue
	let invalid_value = error?.value
	let value = error?.value ?? "";
	
	$: charCount = value.length ?? 0;

	function handle_input(this: HTMLInputElement | HTMLTextAreaElement) {
		value = this.value;

		if (error) {
			if (value !== invalid_value) error.issue = undefined 
			else error.issue = initial_issue
		}
	}
</script>

<div class="grid gap-3">
	<div class="group grid gap-1.25">
		<div class="flex items-center justify-between">
			<label class="text-zinc-100 capitalize" for={name}>{label}</label>
			{#if isNumber(maxlength) && isNumber(minlength)}
				<div class="text-sm font-victor">
					<span class="font-medium {get_char_count_colour(charCount, minlength, maxlength)}">
						{charCount}
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
			<input
				class="w-full py-2.5 px-3 | bg-transparent outline-none placeholder-zinc-400 focus:text-white"
				{type}
				{name}
				{id}
				{placeholder}
				{value}
				required
				on:input={handle_input}
			/>
		</div>
		{#if error?.issue}
			<div class="flex items-center gap-1.5 | text-rose-400">
				<span class="text-xs"> {error.issue} </span>
			</div>
		{/if}
	</div>
</div>
