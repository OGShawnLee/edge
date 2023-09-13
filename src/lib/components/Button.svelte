<script lang="ts">
	import type { Maybe } from "malachite-ui/types";

	let class_name = "";

	export { class_name as class };
	export let title: Maybe<string> = undefined;
	export let label = title;
	export let text: Maybe<string> = undefined;
	export let type: "button" | "reset" | "submit" = "button"
</script>

<button class={class_name} {title} aria-label={label} on:click {type}>
	<slot>{text}</slot>
</button>
