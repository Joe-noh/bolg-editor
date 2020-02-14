<script>
  export let padding = 'm'
</script>

<div class="{`padding-${padding}`}">
  <slot />
</div>

<style lang="scss">
  .padding-s {
    padding: 8px;
  }
  .padding-m {
    padding: 16px;
  }
  .padding-l {
    padding: 24px;
  }
</style>
