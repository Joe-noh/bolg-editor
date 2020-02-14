<script>
  export let gap = 'm'
</script>

<div class="stack {`gap-${gap}`}">
  <slot />
</div>

<style lang="scss">
  @import 'variables.scss';

  .stack {
    display: grid;
  }
  .gap-s {
    gap: $spacer-s;
  }
  .gap-m {
    gap: $spacer-m;
  }
  .gap-l {
    gap: $spacer-l;
  }
</style>
