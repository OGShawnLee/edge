<script lang="ts">
	import Notification from "./Notification.svelte";
	import { Feed, Header, ToggleSidebar } from "$lib/components";
	import { onDestroy } from "svelte";
	import { count_unseen_notifications } from "$lib/state";

	export let data;

	let seen_notifications: string[] = [];

	onDestroy(async () => {
		if (seen_notifications.length > 0) {
			const response = await fetch("/api/notification", {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(seen_notifications),
			});
			if (response.status === 200) {
				$count_unseen_notifications -= seen_notifications.length;
			} 
		}
	});
</script>

<svete:head>
	<title>Notifications - Edge</title>
</svete:head>

<Header title="Notifications" display_name={data.user.display_name} >
	<ToggleSidebar slot="left" />
</Header>
<Feed title="Notifications">
	{#each data.notifications as notification, index (notification.id)}
		<Notification {notification} {index} length={data.notifications.length} {seen_notifications}/>
	{/each}
</Feed>
