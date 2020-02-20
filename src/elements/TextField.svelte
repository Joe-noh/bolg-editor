<script>
  import InputField from './InputField.svelte'

  export let tone = 'normal'
  export let message = null
  export let label = null
  export let value = ''
  export let placeholder = ''
</script>

<InputField {label} {message} {tone}>
  <input class="input {`input-tone-${tone}`}" type="text" {placeholder} bind:value />
</InputField>

<style lang="scss">
  @import 'variables.scss';

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

    &::placeholder {
      color: $placeholder-color;
    }
  }
</style>
