<script lang="ts" context="module">
	function pluralize(count: number, text: string) {
		return count === 1 ? text : text + "s";
	}
</script>

<script lang="ts">
	export let count: number;
	export let text: string;
	export let noplural = false;
	export let href: string | undefined = undefined;
</script>

{#if count}
	<svelte:element 
		class="pr-16px | text-12px text-screen-name-color"
		data-component="count"
		this={href ? "a" : "span"}
		{href}
	>
		<span class="text-white font-medium font-victor"> {count} </span>
		{noplural ? text : pluralize(count, text)}
	</svelte:element>
{/if}

<style>
	a[data-component="count"] {
		@apply "cursor-pointer hover:(underline underline-white)";
	}
</style>
