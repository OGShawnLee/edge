<script lang="ts">
	export let title = "Feed";
	// ensure mobile top header does not overlap with the content
	// pt-6 -> default
	// pt-26 -> mobile-header
	// pt-38 -> mobile-header + mobile-tab-nav
</script>

<!-- pt -> pt-6 + pt-12 (mobile-tab-nav-height) + pt-20 (mobile-header-height) -->
<section class="pt-6 pb-22 | xl:pb-6 grid gap-6" id="feed">
	<h2 class="sr-only">{title}</h2>
	<slot />
</section>
