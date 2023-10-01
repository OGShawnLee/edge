<script>
  import { Feed, Post } from '$lib/components'

  export let data;
</script>

<Feed title="Posts highligthed by {data.found_user.display_name}">
  {#each data.highlights as {id, post}, index (id)}
    <Post
      index={index}
      length={data.highlights.length}
      post={post}
      user={post.user}
    />
  {/each}
</Feed>