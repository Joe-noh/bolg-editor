<script>
  export let font = 'sans'
  export let tone = 'normal'
  export let size = 'm'
</script>

<span class="text {`font-${font}`} {`tone-${tone}`} {`size-${size}`}">
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
    &.size-s {
      font-size: $text-font-size-s;
    }
    &.size-m {
      font-size: $text-font-size-m;
    }
    &.size-l {
      font-size: $text-font-size-l;
    }
  }
</style>
