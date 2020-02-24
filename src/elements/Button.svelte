<script>
  export let tone = 'info'
  export let type = 'filled'
  export let disabled = false
</script>

<button on:click class="button {`tone-${tone}`} {`type-${type}`}" {disabled}>
  <slot />
</button>

<style lang="scss">
  @import 'variables.scss';

  .button {
    cursor: pointer;
    border: none;
    font-weight: 500;
    font-size: 14px;
    padding: 8px 16px;
    min-width: 100px;
    display: flex;
    align-items: center;
  }

  .type-filled {
    border: none;

    &.tone-info {
      color: white;
      background-color: $info-color;
      border: solid 2px $info-color;
    }
    &.tone-success {
      color: white;
      background-color: $success-color;
      border: solid 2px $success-color;
    }
    &.tone-warning {
      color: $main-text-color;
      background-color: $warning-color;
      border: solid 2px $warning-color;
    }
    &.tone-critical {
      color: white;
      background-color: $critical-color;
      border: solid 2px $critical-color;
    }

    &.tone-info:disabled,
    &.tone-success:disabled,
    &.tone-warning:disabled,
    &.tone-critical:disabled {
      color: white;
      background-color: $disabled-color;
      border: solid 2px $disabled-color;
    }
  }

  .type-outlined {
    background-color: white;

    &.tone-info {
      color: $info-color;
      border: solid 2px $info-color;
    }
    &.tone-success {
      color: $success-color;
      border: solid 2px $success-color;
    }
    &.tone-warning {
      color: $warning-color;
      border: solid 2px $warning-color;
    }
    &.tone-critical {
      color: $critical-color;
      border: solid 2px $critical-color;
    }

    &.tone-info:disabled,
    &.tone-success:disabled,
    &.tone-warning:disabled,
    &.tone-critical:disabled {
      color: $disabled-color;
      border: solid 2px $disabled-color;
    }
  }
</style>
