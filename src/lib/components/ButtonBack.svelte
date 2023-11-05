<script>
	import Button from "./Button.svelte";
	import { ArrowLeft } from "lucide-svelte";

  function go_back() {
    history.back();
  }
</script>

<Button class="button button--square--dimmer md:hidden" title="Go back" on:click={go_back}>
  <ArrowLeft size={26} />
</Button>
