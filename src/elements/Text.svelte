<script>
  export let font = 'sans'
</script>

<span class="text {`font-${font}`}">
  <slot />
</span>

<style lang="scss">
  @import 'variables.scss';

  .text {
    color: $main-text-color;
  }
  .font-sans {
    font-family: $font-family-sans;
  }
  .font-serif {
    font-family: $font-family-serif;
  }
  .font-mono {
    font-family: $font-family-mono;
  }
</style>
