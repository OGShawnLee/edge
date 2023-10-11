<script lang="ts">
  import ToastItem from './ToastItem.svelte'

  export let class_name: string

  export {class_name as class}
</script>

<div class={class_name}>
  <slot {ToastItem}/>
</div>
