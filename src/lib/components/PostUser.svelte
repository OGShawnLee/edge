<script lang="ts">
  import type { User } from '@types';
  import Time from './Time.svelte'

  export let user: User;
  export let created_at: Date | undefined = undefined;
  export let is_post_page = false;
</script>

<div class="flex items-baseline" class:pb-12px={is_post_page} >
  <p class="text-top-color font-medium">{user.name}</p>
  <a class="ml-12px | text-14px text-screen-name-color" href="/{user.display_name}">
    @{user.display_name}
  </a>
  {#if created_at}
    <Time {created_at} type="post" />
  {/if}
</div>