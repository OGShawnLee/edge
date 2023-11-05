<script lang="ts">
	import { Nav } from "$lib/components";
	import { found_user_context } from "$lib/context";

	const found_user = found_user_context.getContext();
</script>

{#if $found_user.count_post || $found_user.count_favourite || $found_user.count_highlight > 0}
	{#key $found_user.display_name}
		<Nav base_path="/{$found_user.display_name}" type="tab" mobile_position="static" let:NavLink>
			{#if $found_user.count_post}
				<NavLink href="/" text="Posts" />
			{/if}
			{#if $found_user.count_favourite}
				<NavLink href="/likes" text="Likes" />
			{/if}
			{#if $found_user.count_highlight > 0}
				<NavLink href="/highlights" text="Highlights" />
			{/if}
		</Nav>
	{/key}
{:else}
	<p class="mt-32px | text-center text-datetime-color">
		We appear to be the only ones here, partner.
	</p>
{/if}
