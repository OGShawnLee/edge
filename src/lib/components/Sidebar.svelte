<script lang="ts">
	import Link from "./SidebarLink.svelte";
	import UserStatus from "./SidebarUserStatus.svelte";
	import { Home, UserSquare } from "lucide-svelte";

	export let user: JWTPayloadState | null;
</script>

<!-- top-header-height -> 64px + container-y-gap -> 24px = 88px -->
<nav
	class="sticky h-full top-88px min-w-216px pt-16px pb-38px | flex flex-col justify-between"
>
	{#if user}
		<div class="flex flex-col items-start gap-32px">
			<Link href="/home" text="Home" icon={Home} />
			<Link href="/{user.display_name}" text="Profile" icon={UserSquare} />
		</div>
	{/if}
	<div class="w-full">
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

<style>
	/* top-header-height -> 64px + container-gap -> 28px = 88px */
	nav {
		min-height: calc(100vh - 88px)
	}
</style>
