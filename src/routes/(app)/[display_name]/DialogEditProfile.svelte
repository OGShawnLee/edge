<script>
  import { DialogTitle } from 'malachite-ui'
  import { Dialog, Input } from '$lib/components'
  import { MapPin, UserCircle, X } from 'lucide-svelte'
  import { found_user_context } from '$lib/context'

  export let open = false

  const found_user = found_user_context.getContext()
</script>

<Dialog bind:open let:close>
	<form class="grid gap-4.5" action="?/edit-profile" method="post">
		<header class="px-8 pb-4 | flex items-center gap-4.5 | border-b-2 border-zinc-800">
			<button
				class="h-8 min-w-8 | bg-white rounded-full grid place-content-center hover:(bg-white/80 focus:bg-white)"
				aria-label="Close Dialog"
				title="Close Dialog"
				on:click={close}
				type="button"
			>
				<X class="stroke-zinc-900" size={20} />
			</button>
			<DialogTitle class="text-xl text-white font-medium">Edit Profile</DialogTitle>
			<button
				class="ml-auto px-6 min-h-8 h-8 | bg-white text-zinc-900 font-medium rounded-full hover:(bg-white/80 focus:bg-white)"
				type="submit"
			>
				Save
			</button>
		</header>
		<div class="grid gap-3 px-8">
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