<script>
  export let gap = 'm'
</script>

<div class="stack {`gap-${gap}`}">
  <slot />
</div>

<style>
  .stack {
    display: grid;
  }
  .gap-s {
    gap: 8px;
  }
  .gap-m {
    gap: 16px;
  }
  .gap-l {
    gap: 24px;
  }
</style>
