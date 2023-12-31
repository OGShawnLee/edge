<script lang="ts">
	import type { Post, User } from "@types";
	import Button from "./Button.svelte";
	import Separator from "./Separator.svelte";
	import PostButton from "./PostButton.svelte";
	import Time from "./Time.svelte";
	import { Bookmark, Heart, Lock, Repeat, Sparkles } from "lucide-svelte";
	import { bookmark_route_context } from "$lib/context";
	import { user as current_user, pinned_post_id, pinned_post } from "$lib/state";
	import { deserialize } from "$app/forms";

	export let index: number;
	export let length: number;
	export let post: Post;
	export let user: User;
	export let pinned = false;

	$: is_pinned = pinned || $pinned_post_id === post.id;

	const on_bookmark_deleted = bookmark_route_context.getContext(false);
</script>

{#if post.repost_of || pinned}
	<svelte:self {index} {length} post={post.repost_of ?? post} user={post.repost_of?.user ?? user}>
		<div class="flex items-center gap-8px | text-screen-name-color">
			<svelte:component this={pinned ? Lock : Heart} size="14" />
			<p class="text-12px">
				{#if pinned}
					Pinned Post
				{:else}
					<a class="font-medium" href="/{user.display_name}">
						{user.name}
					</a>
					reposted
				{/if}
			</p>
		</div>
	</svelte:self>
{:else}
	<article class="grid gap-22px">
		<div class="px-24px | grid gap-12px">
			<slot />
			<div>
				<header class="w-full mb-8px | flex items-center gap-24px">
					<div class="flex items-baseline">
						<p class="text-top-color font-medium">{user.name}</p>
						<a class="ml-12px | text-14px text-screen-name-color" href="/{user.display_name}">
							@{user.display_name}
						</a>
						<Time created_at={post.created_at} />
					</div>
					{#if user.id === $current_user?.id}
						<form
							action="/home?/pin-post"
							method="post"
							on:submit|preventDefault={async (event) => {
								const form = event.currentTarget;
								const response = await fetch(form.action, {
									body: new FormData(form),
									method: form.method
								});
								const result = deserialize(await response.text());

								if (result.type !== "success") return;

								if (result.data?.operation === "deleted") {
									$pinned_post = undefined;
									$pinned_post_id = undefined;
								} else if (result.data?.operation === "created") {
									$pinned_post = post;
									$pinned_post_id = post.id;
								}
							}}
						>
							<input type="hidden" name="id" value={post.id} />
							<Button
								class="bg-transparent grid place-content-center"
								type="submit"
								title={is_pinned ? "Unpin Post" : "Pin Post"}
							>
								<Lock
									class={is_pinned ? "text-default-text-color" : "text-datetime-color"}
									size="18"
								/>
							</Button>
						</form>
					{/if}
				</header>
				<h3 class="mb-16px whitespace-pre-line">{post.text}</h3>
				<div class="flex items-center gap-76px">
					<PostButton
						action="/home?/bookmark"
						title="Bookmark or Unbookmark"
						icon={Bookmark}
						is_active_icon={post.is_bookmarked}
						id={post.id}
						count={post.count_bookmark}
						on:delete={(event) => on_bookmark_deleted?.(event.detail)}
					/>
					<PostButton
						action="/home?/favourite"
						active_color="text-rose-500"
						title="Like or Unlike Post"
						icon={Heart}
						is_active_icon={post.is_favourited}
						id={post.id}
						count={post.count_favourite}
					/>
					<PostButton
						action="/home?/repost"
						title="Repost"
						icon={Repeat}
						is_active_icon={post.is_reposted}
						id={post.id}
						count={post.count_repost}
					/>
					<PostButton
						action="/home?/highlight"
						title="Highlight or Unhighlight Post"
						icon={Sparkles}
						is_active_icon={post.is_highlighted}
						id={post.id}
					/>
				</div>
			</div>
		</div>
		{#if index != length - 1}
			<Separator orientation="horizontal" />
		{/if}
	</article>
{/if}
