<script lang="ts">
	import { Separator } from '$lib/components'
	import { Calendar, MapPin } from "lucide-svelte";
	import { found_user_context } from "$lib/context";

	const formatter = Intl.DateTimeFormat("en", { dateStyle: "full", timeStyle: "short" });
	const found_user = found_user_context.getContext()
</script>

<div class="p-6 | grid gap-16px">
	{#if $found_user.description}
		<p class="text-16px">{$found_user.description}</p>
	{/if}
	<div class="grid gap-8px text-screen-name-color">
		<div class="flex items-center gap-8px">
			<Calendar size="18" />
			<time class="text-12px" datetime={$found_user.created_at.toISOString()}>
				Joined {formatter.format($found_user.created_at)}
			</time>
		</div>
		{#if $found_user.location}
			<div class="flex items-center gap-8px">
				<MapPin size="18" />
				<span class="text-12px"> {$found_user.location} </span>
			</div>
		{/if}
	</div>
</div>
<Separator orientation="horizontal"/>