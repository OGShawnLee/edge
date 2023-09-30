<script lang="ts" context="module">
	function pluralize(count: number, text: string) {
		return count === 1 ? text : text + "s";
	}
</script>

<script lang="ts">
	export let count: number;
	export let text: string;
</script>

{#if count}
	<div class="flex items-center gap-8px">
		<span class="text-12px">
			<b> {count} </b>
			{pluralize(count, text)}
		</span>
	</div>
{/if}
