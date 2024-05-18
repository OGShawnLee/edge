<script lang="ts">
	import type { CardUser } from "@types";
	import { Separator } from "$lib/components";

	export let index: number;
	export let length: number;
	export let user: CardUser;
</script>

<a class="grid gap-22px" href="/{user.display_name}">
  <div class="px-24px">
    <h3 class="flex items-baseline">
      <p class="text-top-color font-medium">{user.name}</p>
      <p class="ml-12px | text-14px text-screen-name-color">
        @{user.display_name}
      </p>
    </h3>
    <p class="whitespace-pre-wrap">{user.description}</p>
  </div>
	{#if index !== length - 1}
		<Separator orientation="horizontal" />
	{/if}
</a>
