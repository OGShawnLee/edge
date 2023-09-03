<script lang="ts">
	import { LogOut } from "lucide-svelte";

	export let user: JWTPayloadState;
</script>

<div class="flex items-center justify-between">
	<div class="flex flex-col">
		<p class="text-lg text-white">{user.name}</p>
		<p class="text-sm text-neutral-400">@{user.display_name}</p>
	</div>
	<a
		class="min-h-10 px-4 | grid place-content-center | bg-zinc-800 rounded-md black-ring-white"
		href="/auth/sign-out"
	>
		<LogOut />
	</a>
</div>
