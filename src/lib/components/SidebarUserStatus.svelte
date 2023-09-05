<script lang="ts">
	import { LogOut } from "lucide-svelte";

	export let user: JWTPayloadState;
</script>

<div class="flex items-center justify-between">
	<div class="flex flex-col">
		<p class="text-18px text-top-color">{user.name}</p>
		<p class="text-14px text-screen-name-color">@{user.display_name}</p>
	</div>
	<form action="/auth/sign-out" method="post">
		<button
			class="min-h-10 px-4 | grid place-content-center | bg-separator-vertical rounded-md black-ring-white"
			type="submit"
		>
			<LogOut />
		</button>
	</form>
</div>
