<script>
  export let padding = 'm'
</script>

<div class="{`padding-${padding}`}">
  <slot />
</div>

<style lang="scss">
  @import 'variables.scss';

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
