<script lang="ts">
	import type { Maybe } from 'malachite-ui/types';
	import { get_char_count_colour } from '$lib/utils';
  import { isNumber } from 'malachite-ui/predicate'

  export let maxlength: Maybe<number>
  export let minlength: Maybe<number>
  export let char_count: number;
</script>

{#if isNumber(maxlength) && isNumber(minlength)}
<div class="text-14px font-victor">
  <span class="font-medium {get_char_count_colour(char_count, minlength, maxlength)}">
    {char_count}
  </span>
  <span> / </span>
  <span class="font-bold"> {maxlength} </span>
</div>
{/if}