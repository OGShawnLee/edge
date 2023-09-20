<script>
	import Notification from "./Notification.svelte";
	import { Feed, Header } from "$lib/components";

	export let data;
</script>

<svete:head>
	<title>Notifications - Edge</title>
</svete:head>

<Header title="Notifications" display_name={data.user.display_name} />
<Feed title="Notifications">
	{#each data.notifications as notification, index (notification.id)}
		<Notification {notification} {index} length={data.notifications.length} />
	{/each}
</Feed>
