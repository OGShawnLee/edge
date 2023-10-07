<script lang="ts">
	import type { Nullable } from "malachite-ui/types";

	let class_name: string | undefined = undefined;

	export { class_name as class };
	export let src: Nullable<string> = undefined;
	export let id: string;
	export let name = id;

	let files: FileList;
	let input_ref: HTMLInputElement;

	$: if (files) {
		handle_image_input(files);
	}

	function handle_image_input(files: FileList) {
		const file = files.item(0);
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				src = reader.result as string;
			};
			reader.readAsDataURL(file);
		}
	}
</script>

<div
	class={class_name}
	role="button"
	aria-label="Change avatar"
	title="Change avatar"
	tabindex="0"
	on:click={() => input_ref.click()}
	on:keydown={(e) => e.key === "Enter" && input_ref.click()}
>
	<slot {src} />
	<input
		class="hidden"
		type="file"
		accept="image/png, image/jpg, image/jpeg"
		bind:this={input_ref}
		bind:files
		{name}
		{id}
	/>
</div>
