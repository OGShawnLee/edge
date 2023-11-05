<script>
  import { Dialog, DialogHeader, Input } from '$lib/components'
  import { MapPin, UserCircle } from 'lucide-svelte'
  import { found_user_context } from '$lib/context'

  export let open = false

  const found_user = found_user_context.getContext()
</script>

<Dialog bind:open let:close>
	<form class="grid gap-4.5" action="?/edit-profile" method="post">
		<DialogHeader title="Editing Profile" prompt="Update Profile" prompt_mobile="Save" {close} />
		<div class="grid gap-3 px-6">
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