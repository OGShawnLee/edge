<script lang="ts" context="module">
	import { isNullish } from "malachite-ui/predicate";

	export interface HTMLExpandableTextArea extends HTMLTextAreaElement {
		baseScrollHeight: number;
	}

	// Yair Evan Or https://codepen.io/vsync/pen/bGgQzL
	// I have no idea how this works, why it works and why my modifications fixed bugs
	function handle_expandable_area(this: HTMLExpandableTextArea) {
		if (this.value.length >= this.maxLength - 4) return;

		const minimum = this.getAttribute("data-minimum-rows");
		const finalMinimum = minimum ? +minimum : 3;
		let rows: number;

		if (isNullish(this.baseScrollHeight)) set_scroll_height(this);

		this.rows = finalMinimum;
		rows = Math.ceil((this.scrollHeight - this.baseScrollHeight) / 28);
		this.rows = finalMinimum + rows;
	}

	function set_scroll_height(element: HTMLExpandableTextArea) {
		const value = element.value;
		element.value = "";
		element.baseScrollHeight = element.scrollHeight;
		element.value = value;
	}
</script>

<script lang="ts">
	import type { Nullable } from "malachite-ui/types";

	let class_name: Nullable<string> = "w-full bg-transparent";

	export { class_name as class };
	export let autofocus = false;
	export let char_count = 0;
	export let element: HTMLTextAreaElement | undefined = undefined;
	export let id: string;
	export let label: Nullable<string> = undefined;
	export let minlength = 0;
	export let maxlength = 280;
	export let name = id;
	export let padding = "py-2.5";
	export let placeholder: Nullable<string> = undefined;
	export let required = false;
	export let value: Nullable<string> = "";

	$: char_count = value?.length ?? 0;

	function on_text_area_mount(element: HTMLTextAreaElement) {
		handle_expandable_area.bind(element as HTMLExpandableTextArea)();
	}
</script>

{#if label}
	<label class="sr-only" for={id}>{label}</label>
{/if}
<!-- svelte-ignore a11y-autofocus -->
<textarea
	class="{class_name} {padding} | block | outline-none placeholder-datetime-color resize-none focus:text-white"
	{name}
	{id}
	cols="10"
	rows="1"
	{autofocus}
	{minlength}
	{maxlength}
	{placeholder}
	{required}
	data-minimum-rows="1"
	on:input={handle_expandable_area}
	bind:value
	bind:this={element}
	on:click
	on:focus
	on:keydown
	use:on_text_area_mount
/>
