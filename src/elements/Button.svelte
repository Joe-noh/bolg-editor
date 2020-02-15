<script>
  export let tone
  export let type = 'filled'
</script>

<button on:click class="button {`tone-${tone}`} {`type-${type}`}">
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
  }

  .type-filled {
    border: none;
  }
  .type-filled.tone-success {
    color: white;
    background-color: $success-color;
    border: solid 2px $success-color;
  }
  .type-filled.tone-warning {
    color: $main-text-color;
    background-color: $warning-color;
    border: solid 2px $warning-color;
  }
  .type-filled.tone-critical {
    color: white;
    background-color: $critical-color;
    border: solid 2px $critical-color;
  }

  .type-outlined.tone-success {
    color: $success-color;
    border: solid 2px $success-color;
  }
  .type-outlined.tone-warning {
    color: $warning-color;
    border: solid 2px $warning-color;
  }
  .type-outlined.tone-critical {
    color: $critical-color;
    border: solid 2px $critical-color;
  }
</style>
