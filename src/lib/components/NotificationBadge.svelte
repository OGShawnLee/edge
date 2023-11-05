<script>
	import { count_unseen_notifications } from "$lib/state";
</script>

{#if $count_unseen_notifications > 0}
	<div
		class="absolute top-0 left-0 | flex items-center justify-center | w-16px h-16px | text-12px font-bold | bg-red-500 rounded-full"
	>
		<span class="text-white">
			{$count_unseen_notifications}
		</span>
	</div>
{/if}
