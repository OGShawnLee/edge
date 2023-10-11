<script lang="ts">
	import { toast } from "$lib/state";

	let class_name: string;

	export { class_name as class };
	export let id: number;
	
	const { close, mount } = toast.create_toast_item(id);
</script>

<div class={class_name} use:mount>
	<slot {close} />
</div>
