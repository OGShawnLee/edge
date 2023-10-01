<script>
  import { Header, Nav } from "$lib/components";

  export let data;
</script>

<Header
  title={data.found_user.name}
  display_name={data.found_user.display_name}
/>
<Nav base_path="/{data.found_user.display_name}" let:NavLink>
  {#if data.found_user.count_follower}
    <NavLink href="/followers" text="Followers" />
  {/if}
  {#if data.found_user.count_following}
    <NavLink href="/following" text="Following" />
  {/if}
</Nav>
<slot />