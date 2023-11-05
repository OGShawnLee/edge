<script lang="ts">
	import { Count, Separator } from "$lib/components";
	import { Calendar, MapPin, Smile } from "lucide-svelte";
	import { found_user_context } from "$lib/context";

	const formatter = Intl.DateTimeFormat("en", { dateStyle: "full", timeStyle: "short" });
	const found_user = found_user_context.getContext();
</script>

<div class="px-24px py-22px | grid gap-16px">
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
		{#if $found_user.is_following}
			<div class="flex items-center gap-8px">
				<Smile size="18" />
				<span class="text-12px"> 
					{$found_user.is_followed ? "Follows you back" : "Follows you"}  
				</span>
			</div>
		{/if}
	</div>
	{#if $found_user.count_favourite || $found_user.count_post || $found_user.count_highlight}
		<div class="flex flex-wrap gap-x-4 gap-y-1.25">
			<Count
				count={$found_user.count_follower}
				text="Follower"
				href="/{$found_user.display_name}/followers"
			/>
			<Count
				count={$found_user.count_following}
				text="Following"
				noplural
				href="/{$found_user.display_name}/following"
			/>
			<Count count={$found_user.count_post} text="Post" />
			<Count count={$found_user.count_favourite} text="Like" />
			<Count count={$found_user.count_highlight} text="Highlight" />
		</div>
	{/if}
</div>
<Separator orientation="horizontal" />
