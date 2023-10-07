<script lang="ts">
	import { Dialog, DialogHeader, InputImage, Input } from "$lib/components";
	import { Image, MapPin, UserCircle } from "lucide-svelte";
	import { found_user_context } from "$lib/context";

	export let open = false;

	const found_user = found_user_context.getContext();
</script>

<Dialog bind:open let:close>
	<form class="grid gap-4.5" action="?/edit-profile" method="post" enctype="multipart/form-data">
		<DialogHeader title="Editing Profile" prompt="Update Profile" {close} />
		<div class="grid gap-3 px-6">
			<div class="flex items-center justify-start gap-3">
				<InputImage
					class="h-64px w-64px min-w-64px relative | rounded-8px overflow-hidden"
					id="avatar"
					src={$found_user.avatar}
					let:src
				>
					<div
						class="absolute bottom-1/2 right-1/2 translate-1/2 p-8px rounded-full bg-background-color/30"
					>
						<Image />
					</div>
					{#if src}
						<img class="h-full w-full object-center object-cover" {src} alt="avatar" />
					{:else}
						<div class="h-full w-full bg-input-color" />
					{/if}
				</InputImage>
				<label class="cursor-pointer" for="avatar"> Change Avatar </label>
			</div>
			<Input
				id="name"
				icon={UserCircle}
				value={$found_user?.name}
				placeholder={$found_user?.name}
				maxlength={50}
				minlength={1}
			/>
			<Input
				id="description"
				type="textarea"
				value={$found_user.description}
				minlength={0}
				maxlength={160}
				required={false}
			/>
			<Input
				id="location"
				value={$found_user.location}
				placeholder={$found_user.location}
				icon={MapPin}
				minlength={0}
				maxlength={30}
				required={false}
			/>
		</div>
	</form>
</Dialog>
