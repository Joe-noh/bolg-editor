<script>
  export let padding = 'm'
</script>

<div class="{`padding-${padding}`}">
  <slot />
</div>

<style>
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
