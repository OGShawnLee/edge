<script>
  import { Github } from 'lucide-svelte'
</script>

<aside class="sticky h-full top-88px w-300px pt-16px pb-38px | flex flex-col justify-between">
  <div class="mt-auto | flex items-center gap-2.25 | text-left text-12px text-datetime-color">
    <a href="https://github.com/OGShawnLee/edge" target="_blank" aria-label="View Project on GitHub" title="View Project on GitHub">
      <Github />
    </a>
    <p> 
      Developed by
      <a class="font-medium" href="https://github.com/OGShawnLee" target="_blank"> Shawn Lee </a> 
    </p>
  </div>
</aside>

<style>
	/* top-header-height -> 64px + container-gap -> 28px = 88px */
	aside {
		min-height: calc(100vh - 88px);
	}
</style>
