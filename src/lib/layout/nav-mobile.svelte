<script>
	import { Home, Bell, Bookmark, LogIn, UserCircle } from "lucide-svelte";
	import { Nav, NotificationBadge } from "$lib/components";
	import { user } from '$lib/state';
</script>

<Nav base_path="/home" type="mobile-nav" let:NavLink>
	<NavLink href="/home" text="Home" icon={Home} label="go to home page" />
	{#if $user}
		<NavLink
			href="/i/notifications"
			text="Notifications"
			icon={Bell}
			label="go to notifications page"
		>
			<NotificationBadge />
		</NavLink>
		<NavLink
			href="/{$user.display_name}"
			text="Profile"
			icon={UserCircle}
			label="go to your profile page"
		/>
		<NavLink href="/i/bookmarks" text="Bookmarks" icon={Bookmark} label="go to bookmarks page" />
	{:else}
		<NavLink href="/auth/login" text="Login" icon={LogIn} label="go to login page" />
	{/if}
</Nav>
