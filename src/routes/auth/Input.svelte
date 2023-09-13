<script lang="ts">
	import type { Maybe } from "malachite-ui/types";
	import type { SvelteComponent } from "svelte";
	import { isNullish, isWhitespace } from "malachite-ui/predicate";
	import { fade, slide } from "svelte/transition";

	export let already_filled: boolean;
	export let button_text = "next"
	export let error: Maybe<FormItemError> = undefined;
	export let id: string;
	export let element: HTMLInputElement;
	export let label: string;
	export let name = id;
	export let icon: typeof SvelteComponent;
	export let type = id === "password" ? "password" : "text";
	export let placeholder: Maybe<string> = undefined;
	export let value: Maybe<string> = error?.value ?? "";
	export let current_step: number;
	export let step: number;
	export let submit = false;

	$: disabled = isNullish(value) || isWhitespace(value);

	function handle_keydown(event: KeyboardEvent) {
		if (event.code === "Enter") event.preventDefault();
	}

	function handle_input(this: HTMLInputElement) {
		value = this.value;
		error = undefined;
	}
</script>

{#if already_filled || current_step >= step || step === 0}
	<div class="group grid gap-1.25" transition:slide>
		<label class="h-20px text-14px" for={id}> {label} </label>
		<div>
			<div class="min-h-12 flex items-center">
				<svelte:component this={icon} class="stroke-datetime-color group-focus-within:stroke-top-color" />
				<input
					class="w-sm px-12px | bg-transparent outline-none font-medium placeholder-zinc-600"
					{type}
					{name}
					{id}
					{placeholder}
					{value}
					on:keydown={handle_keydown}
					on:input={handle_input}
					bind:this={element}
				/>
				{#if submit || (current_step === step && !already_filled)}
					<button
						class="bg-transparent outline-none font-medium focus:text-white"
						class:text-datetime-color={disabled}
						out:fade
						type={submit ? "submit" : "button"}
						{disabled}
						on:click
					>
						{button_text}
					</button>
				{/if}
			</div>
			{#if error?.issue}
				<div class="flex items-center gap-1.5 | text-rose-400" transition:slide>
					<span class="text-xs"> {error.issue} </span>
				</div>
			{/if}
		</div>
	</div>
{/if}

<style>
	input:-webkit-autofill,
	input:-webkit-autofill:hover,
	input:-webkit-autofill:focus,
	input:-webkit-autofill:active {
		-webkit-background-clip: text;
		-webkit-text-fill-color: #ffffff;
		transition: background-color 5000s ease-in-out 0s;
	}
</style>
