<script lang="ts">
	import Link from "./SidebarLink.svelte";
	import { SidebarMobile  } from "$lib/layout";
	import UserStatus from "./SidebarUserStatus.svelte";
	import { Bell, Bookmark, Home, UserSquare } from "lucide-svelte";
	import { count_unseen_notifications, user } from "$lib/state";
</script>

<!-- top-header-height -> 64px + container-y-gap -> 24px = 88px -->
<nav
	class="hidden sticky h-full top-88px w-300px pt-16px pb-38px | xl:flex flex-col justify-between"
>
	<div class="flex flex-col items-start gap-32px">
		<Link href={$user ? "/home" : "/"} text="Home" icon={Home} />
		{#if $user}
			<div class="relative">
				<Link href="/i/notifications" text="Notifications" icon={Bell} />
				{#if $count_unseen_notifications > 0}
					<div
						class="absolute top-0 left-0 | flex items-center justify-center | w-16px h-16px | text-12px font-bold | bg-red-500 rounded-full"
					>
						{$count_unseen_notifications}
					</div>
				{/if}
			</div>
			<Link href="/{$user.display_name}" text="Profile" icon={UserSquare} />
			<Link href="/i/bookmarks" text="Bookmarks" icon={Bookmark} />
		{/if}
	</div>
	<div class="w-full">
		{#if $user}
			<UserStatus user={$user} />
		{:else}
			<a class="button button--top" href="/auth/sign-in"> Access Edge </a>
		{/if}
	</div>
</nav>

<!-- mobile sidebar -->
<SidebarMobile />

<style>
	/* top-header-height -> 64px + container-gap -> 28px = 88px */
	nav {
		min-height: calc(100vh - 88px);
	}
</style>
