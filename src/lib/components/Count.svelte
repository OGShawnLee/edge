<script lang="ts" context="module">
	function pluralize(count: number, text: string) {
		return count === 1 ? text : text + "s";
	}
</script>

<script lang="ts">
	export let count: number;
	export let text: string;
	export let noplural = false;
</script>

{#if count}
	<span class="pr-16px | space-x-1.5px | text-12px text-screen-name-color">
		<span class="text-white font-medium font-victor"> {count} </span>
		<span>
			{noplural ? text : pluralize(count, text)}
		</span>
	</span>
{/if}
