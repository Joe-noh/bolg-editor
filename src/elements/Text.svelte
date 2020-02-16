<script>
  export let font = 'sans'
  export let tone = 'normal'
</script>

<span class="text {`font-${font}`} {`tone-${tone}`}">
  <slot />
</span>

<style lang="scss">
  @import 'variables.scss';

  .text {
    &.font-sans {
      font-family: $font-family-sans;
    }
    &.font-serif {
      font-family: $font-family-serif;
    }
    &.font-mono {
      font-family: $font-family-mono;
    }
    &.tone-normal {
      color: $main-text-color;
    }
    &.tone-success {
      color: $success-color;
    }
    &.tone-critical {
      color: $critical-color;
    }
  }
</style>
