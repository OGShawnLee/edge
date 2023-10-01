<script>
  import { Feed, Post } from "$lib/components";

  export let data;
</script>

<Feed title="Posts liked by {data.found_user.display_name}">
  {#each data.favourites as { id, post }, index (id)}
    <Post {post} user={post.user} {index} length={data.favourites.length} />
  {/each}
</Feed>