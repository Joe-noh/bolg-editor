<script>
  import Text from './Text.svelte'

  export let tone = 'normal'
  export let message = null
  export let label = null
</script>

<label class="text-field">
  {#if label}
    <div class="label">
      <Text>{label}</Text>
    </div>
  {/if}
  <slot />
  {#if message}
    <Text {tone} size="s">{message}</Text>
  {/if}
</label>

<style lang="scss">
  @import 'variables.scss';

  .text-field {
    display: flex;
    flex-flow: column nowrap;
    color: $main-text-color;
  }
  .label {
    margin-bottom: $spacer-xs;
  }
  .input {
    width: 100%;
    font-size: 16px;
    padding: $spacer-s;
    box-sizing: border-box;

    &.input-tone-normal {
      border: solid 1px $border-color;
    }
    &.input-tone-success {
      border: solid 1px $success-color;
    }
    &.input-tone-critical {
      border: solid 1px $critical-color;
    }
  }
</style>
