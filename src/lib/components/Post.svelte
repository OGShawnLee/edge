<script lang="ts">
	import type { Post, User } from "@types";
	import Button from "./Button.svelte";
	import Separator from "./Separator.svelte";
	import PostButtonSection from "./PostButtonSection.svelte";
	import PostUser from "./PostUser.svelte";
	import { Bookmark, Heart, Lock, Repeat, Sparkles } from "lucide-svelte";
	import { bookmark_route_context } from "$lib/context";
	import { user as current_user, pinned_post_id, pinned_post, toast } from "$lib/state";
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
					<PostUser {user} created_at={post.created_at} />
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

								if (result.type !== "success") {
									return toast.push({
										message: "Unable to pin post.",
										type: "error"
									});
								}

								if (result.data?.operation === "deleted") {
									$pinned_post = undefined;
									$pinned_post_id = undefined;
									toast.push({
										message: "Your post has been unpinned successfully.",
										type: "success"
									});
								} else if (result.data?.operation === "created") {
									$pinned_post = post;
									$pinned_post_id = post.id;
									toast.push({
										message: "Your post has been pinned successfully.",
										type: "success"
									});
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
				<h3 class="mb-16px whitespace-pre-line">
					<a href="/{user.display_name}/status/{post.id}">
						{post.text}
					</a>
				</h3>
				<PostButtonSection {post} type="post" />
			</div>
		</div>
		{#if index != length - 1}
			<Separator orientation="horizontal" />
		{/if}
	</article>
{/if}
