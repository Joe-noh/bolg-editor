<script>
  import InputField from './InputField.svelte'

  export let tone = 'normal'
  export let message = null
  export let label = null
  export let rows = 5
  export let value = ''
  export let placeholder = ''
</script>

<InputField {label} {message} {tone}>
  <textarea class="textarea {`textarea-tone-${tone}`}" type="text" {placeholder} {rows} bind:value></textarea>
</InputField>

<style lang="scss">
  @import 'variables.scss';

  .textarea {
    width: 100%;
    font-size: 16px;
    padding: $spacer-s;
    box-sizing: border-box;

    &.textarea-tone-normal {
      border: solid 1px $border-color;
    }
    &.textarea-tone-success {
      border: solid 1px $success-color;
    }
    &.textarea-tone-critical {
      border: solid 1px $critical-color;
    }
  }
</style>
