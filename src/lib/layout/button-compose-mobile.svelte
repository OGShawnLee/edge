<script>
	import { PenTool } from "lucide-svelte";
	import { move_on_scroll_down } from "$lib/actions";
</script>

<a
	class="fixed bottom-84px -right-3 xl:hidden | w-16 h-16 | rounded-l-full | bg-teal-600 | flex items-center justify-center | shadow-lg"
	aria-label="compose"
	href="/i/compose"
	use:move_on_scroll_down={{
		offset: 36,
		position: "bottom",
		translate_class_name: "translate-y-16"
	}}
>
	<PenTool size={32} />
</a>
