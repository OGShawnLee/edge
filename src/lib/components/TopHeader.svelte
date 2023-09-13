<script lang="ts">
	import CharCount from "./CharCount.svelte";
	import Dialog from "./Dialog.svelte";
	import DialogHeader from "./DialogHeader.svelte";
	import TextArea from "./TextArea.svelte";
	import { Sun } from "lucide-svelte";
	import { user } from "$lib/state";
	import { deserialize } from "$app/forms";

	let char_count = 0
	let open = false;
	let initial_focus: HTMLTextAreaElement
	let post = ""

	function open_text_area() {
		open = true;
	}

	async function handle_submit(this: HTMLFormElement) {
		const response = await fetch(this.action, {
			body: new FormData(this),
			method: this.method
		}) 

		const result = deserialize(await response.text());
		if (result.type === "success") {
			open = false;
			post = ""
			alert("Post has been publised!")
		};
	}
</script>

<!-- central-content-layout-x-gap -> 32px -->
<!-- central-content-x-marging -> 24px -->
<!-- sidebar-length = 300px -->
<!-- logo-length = layout-x-gap + central-content-x-marging = 356px -->
<!-- we use that length to push the text-area to the middle of the page x-axis  -->

<Dialog bind:open {initial_focus} let:close>
	<form class="grid gap-4.5" action="/home?/post" method="post" on:submit|preventDefault={handle_submit}>
		<DialogHeader title="Creating Post" prompt="Post" {close} >
			<CharCount {char_count} maxlength={280} minlength={1} />
		</DialogHeader>
		<div class="px-6">
			<TextArea
				class="w-full px-16px | bg-background-color rounded-md"
				id="post"
				placeholder="What is happening?"
				bind:char_count
				bind:element={initial_focus}
				bind:value={post}
			/>
		</div>
	</form>
</Dialog>

<div class="sticky top-0 z-10 h-64px | bg-black">
	<div class="max-w-6xl w-full h-full mx-auto | flex items-center gap-32px">
		<!-- logo-length applied here as min-w-300px -->
		<span class="min-w-356px | uppercase text-top-color text-24px font-bold tracking-1">
			Edge | X
		</span>
		{#if $user}
			<button
				class="absolute-center | w-504px px-16px py-2.5 | bg-background-color text-datetime-color text-left rounded-md black-ring-white"
				on:click={open_text_area}
				aria-label="Start a new Post"
				title="Start a new Post"
			>
				What is happening?
			</button>
			<!-- <TextArea
				class="absolute-center w-504px px-16px | bg-background-color rounded-md"
				id="post"
				placeholder="What is happening?"
				on:focus={open_text_area}
			/> -->
		{/if}
		<button class="ml-auto | bg-transparent" title="Change Color Theme">
			<Sun />
		</button>
	</div>
</div>

<style>
	:global(.text-area-width) {
		width: calc(600px - 54px - 54px);
	}
</style>
