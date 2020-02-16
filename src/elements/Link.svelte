<script>
  export let href
  export let newTab = false

  $: newTabAttrs = newTab ? { target: '_blank', rel: 'noopener' } : {}
</script>

<a class="link" {href} {...newTabAttrs}>
  <slot />
</a>

<style lang="scss">
  @import 'variables.scss';

  .link {
    color: $main-text-color;
  }
</style>
