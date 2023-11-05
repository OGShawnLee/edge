<script lang="ts">
	import { PostUser, Separator, SidebarLink } from "$lib/components";
	import { Dialog } from "malachite-ui";
	import { Bell, Bookmark, Home, LogOut, LogIn, PanelRightOpen, PenTool, UserSquare } from "lucide-svelte";
	import { count_unseen_notifications, mobile_sidebar_open, user } from "$lib/state";
	import { fade, slide } from "svelte/transition";
	import { hide_scrollbar } from "$lib/actions";
</script>

<Dialog bind:open={$mobile_sidebar_open} let:content let:close let:overlay>
	<div class="backdrop" use:overlay transition:fade|global={{ duration: 200 }} />
	<div
		class="fixed inset-y-0 z-90"
		use:content
		use:hide_scrollbar
		transition:slide|global={{ duration: 200, axis: "x" }}
	>
		<div class="w-280px h-full pb-24px | bg-dialog-color">
			<div class="h-80px px-24px | flex items-center gap-16px">
				<button class="grid place-content-center | bg-transparent" on:click={close}>
					<PanelRightOpen size={26} />
				</button>
				<a class="uppercase text-top-color text-24px font-bold tracking-1" href="/"> Edge | X </a>
			</div>
			<Separator orientation="horizontal" bg_lighter />
			{#if $user}
				<div class="px-24px py-24px | flex flex-col items-start gap-32px">
					<PostUser user={$user} />
					<SidebarLink href="/home" text="Home" icon={Home} />
					<div class="relative">
						<SidebarLink href="/i/notifications" text="Notifications" icon={Bell} />
						{#if $count_unseen_notifications > 0}
							<div
								class="absolute top-0 left-0 | flex items-center justify-center | w-16px h-16px | text-12px font-bold | bg-red-500 rounded-full"
							>
								{$count_unseen_notifications}
							</div>
						{/if}
					</div>
					<SidebarLink href="/{$user.display_name}" text="Profile" icon={UserSquare} />
					<SidebarLink href="/i/bookmarks" text="Bookmarks" icon={Bookmark} />
				</div>
				<Separator orientation="horizontal" bg_lighter />
				<div class="px-24px py-24px | flex flex-col items-start gap-32px">
					<a class="flex gap-4" href="/i/compose">
						<PenTool />
						<span> Compose </span>
					</a>
					<form action="/auth/sign-out" method="post">
						<button class="flex gap-4 | bg-transparent">
							<LogOut />
							<span> Sign out </span>
						</button>
					</form>
				</div>
			{:else}
				<Separator orientation="horizontal" bg_lighter />
				<SidebarLink href="/auth/sign-in" text="Sign in" icon={LogIn} />
			{/if}
		</div>
	</div>
</Dialog>
