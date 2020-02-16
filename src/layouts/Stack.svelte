<script>
  export let gap = 'm'
  export let padding = 'none'
</script>

<div class="stack {`gap-${gap}`} {`padding-${padding}`}">
  <slot />
</div>

<style lang="scss">
  @import 'variables.scss';

  .stack {
    display: grid;
    width: 100%;
    box-sizing: border-box;
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
  .padding-none {
    padding: 0;
  }
  .padding-s {
    padding: $spacer-s;
  }
  .padding-m {
    padding: $spacer-m;
  }
  .padding-l {
    padding: $spacer-l;
  }
</style>
