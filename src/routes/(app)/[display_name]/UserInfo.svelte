<script lang="ts">
	import { Calendar, MapPin } from "lucide-svelte";
	import { found_user_context } from "$lib/context";

	const formatter = Intl.DateTimeFormat("en", { dateStyle: "full", timeStyle: "short" });
	const found_user = found_user_context.getContext()
</script>

<div class="px-8 py-4 | grid gap-3">
	{#if $found_user.description}
		<p>{$found_user.description}</p>
	{/if}
	<div class="grid gap-1.5">
		<div class="flex items-center gap-1.75">
			<Calendar class="stroke-zinc-300" size="18" />
			<time class="text-xs text-zinc-500" datetime={$found_user.created_at.toISOString()}>
				Joined {formatter.format($found_user.created_at)}
			</time>
		</div>
		{#if $found_user.location}
			<div class="flex items-center gap-1.75">
				<MapPin class="stroke-zinc-300" size="18" />
				<span class="text-xs text-zinc-500"> {$found_user.location} </span>
			</div>
		{/if}
	</div>
</div>
