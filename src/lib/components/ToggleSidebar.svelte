<script>
	import Button from "./Button.svelte";
	import { PanelRightClose } from "lucide-svelte";
	import { mobile_sidebar_open } from "$lib/state";
</script>

<Button
	class="grid place-content-center | bg-transparent xl:hidden"
	title="Open Sidebar"
	on:click={() => ($mobile_sidebar_open = true)}
>
	<PanelRightClose size={26} />
</Button>
