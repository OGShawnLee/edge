<script>
	import { Header, PostUser, PostButtonSection, Separator, Time } from "$lib/components";
	import { ArrowLeft } from "lucide-svelte";

	export let data;
</script>

<svelte:head>
	<title>{data.found_user.name} on Edge | X: "{data.found_post.text}"</title>
</svelte:head>

<Header title="Post">
	<a
		class="button button--square"
		href="/{data.found_user.display_name}"
		aria-label="View {data.found_user.name}'s profile"
		title="View {data.found_user.name}'s profile"
	>
		<ArrowLeft size={18}/>
	</a>
</Header>
<main>
	<div>
		<div class="p-22px">
			<PostUser user={data.found_user} is_post_page />
			<h2 class="mb-16px whitespace-pre-line">
				{data.found_post.text}
			</h2>
			<div>
				<Time created_at={data.found_post.created_at} type="post-page" />
			</div>
		</div>
		<div class="grid gap-16px">
			<PostButtonSection post={data.found_post} type="post-page" />
			<Separator orientation="horizontal" />
		</div>
	</div>
</main>
