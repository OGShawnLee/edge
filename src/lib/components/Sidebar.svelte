<script lang="ts">
	import Link from "./SidebarLink.svelte";
	import UserStatus from "./SidebarUserStatus.svelte";
	import { Home, UserCircle, Twitter } from "lucide-svelte";

	export let user: JWTPayloadState | null;
</script>

<nav
	class="sticky top-0 min-h-screen min-w-62 pt-10 pr-8 pb-8 | flex flex-col items-start gap-12 | border-r-2 border-zinc-800"
>
	<Twitter class="mx-0 stroke-white fill-white" />
	{#if user}
		<div class="flex flex-col items-start gap-6">
			<Link href="/home" text="Home" icon={Home} />
			<Link href="/{user.display_name}" text="Profile" icon={UserCircle} />
		</div>
	{/if}
	<div class="w-full mt-auto">
		{#if user}
			<UserStatus {user} />
		{:else}
			<a
				class="min-h-10 px-8 | grid place-content-center | bg-indigo-700 rounded-md text-white font-medium black-ring-white"
				href="/auth/sign-in"
			>
				Sign in
			</a>
		{/if}
	</div>
</nav>
