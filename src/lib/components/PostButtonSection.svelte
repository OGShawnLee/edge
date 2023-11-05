<script lang="ts">
	import type { Post } from "@types";
	import PostButton from "./PostButton.svelte";
	import { Bookmark, Heart, Repeat, Sparkles } from "lucide-svelte";
	import { bookmark_route_context } from "$lib/context";
	import { toast } from "$lib/state";

	export let post: Post;
	export let type: "post" | "post-page";

	const on_bookmark_deleted = bookmark_route_context.getContext(false);
</script>

<div
	class="w-full flex items-center {type === 'post-page'
		? 'justify-between'
		: 'justify-between xl:justify-initial'} xl:gap-76px"
	class:px-22px={type === "post-page"}
>
	<PostButton
		action="/home?/favourite"
		active_color="text-rose-500"
		title="Like or Unlike Post"
		icon={Heart}
		is_active_icon={post.is_favourited}
		id={post.id}
		count={post.count_favourite}
		on:submit={(event) => {
			if (event.detail !== "error") return;
			toast.push({
				message: "Unable to like post.",
				type: "error"
			});
		}}
	/>
	<PostButton
		action="/home?/repost"
		title="Repost"
		icon={Repeat}
		is_active_icon={post.is_reposted}
		id={post.id}
		count={post.count_repost}
		on:submit={(event) => {
			if (event.detail === "created") {
				return toast.push({
					message: "Post has been reposted successfully.",
					type: "success"
				});
			} else if (event.detail === "error") {
				return toast.push({
					message: "Unable to repost post.",
					type: "error"
				});
			}
		}}
	/>
	<PostButton
		action="/home?/bookmark"
		title="Bookmark or Unbookmark"
		icon={Bookmark}
		is_active_icon={post.is_bookmarked}
		id={post.id}
		count={post.count_bookmark}
		on:submit={(event) => {
			if (event.detail === "created") {
				return toast.push({
					message: "Post has been bookmarked successfully.",
					type: "success"
				});
			} else if (event.detail === "error") {
				return toast.push({
					message: "Unable to bookmark post.",
					type: "error"
				});
			} else {
				on_bookmark_deleted?.(post.id);
				return toast.push({
					message: "Post has been unbookmarked successfully.",
					type: "success"
				});
			}
		}}
	/>
	<PostButton
		action="/home?/highlight"
		title="Highlight or Unhighlight Post"
		icon={Sparkles}
		is_active_icon={post.is_highlighted}
		id={post.id}
		on:submit={(event) => {
			if (event.detail === "created") {
				return toast.push({
					message: "Post has been highlighted successfully.",
					type: "success"
				});
			} else if (event.detail === "error") {
				return toast.push({
					message: "Unable to highlight post.",
					type: "error"
				});
			} else {
				return toast.push({
					message: "Post has been unhighlighted successfully.",
					type: "success"
				});
			}
		}}
	/>
</div>
