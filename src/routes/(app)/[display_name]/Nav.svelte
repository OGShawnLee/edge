<script lang="ts">
  import NavLink from "./NavLink.svelte";
  import { Separator } from "$lib/components";
</script>

<nav class="h-48px | flex items-center justify-around">
  <NavLink href="/" text="Posts" />
  <NavLink href="/likes" text="Likes" />
</nav>
<Separator orientation="horizontal" />