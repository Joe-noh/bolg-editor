<script>
  export let tone = 'info'
  export let type = 'filled'
  export let size = 'm'
  export let disabled = false
  export let icon = null
</script>

<button on:click class="button {`tone-${tone}`} {`type-${type}`} {`size-${size}`}" {disabled}>
  {#if icon}
    <span class="icon {`tone-${tone}`} {`type-${type}`} {`size-${size}`} {disabled && 'disabled'}">
      <svelte:component this="{icon}" />
    </span>
  {/if}
  <slot />
</button>

<style lang="scss">
  @import 'variables.scss';

  .button {
    cursor: pointer;
    border: none;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;

    &.type-filled {
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

    &.type-outlined {
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

    &.size-s {
      font-size: $text-font-size-s;
      padding: $spacer-xs $spacer-s;
    }

    &.size-m {
      font-size: $text-font-size-s;
      padding: $spacer-s $spacer-m;
    }

    &.size-l {
      font-size: $text-font-size-l;
      padding: $spacer-m $spacer-l;
    }
  }

  .icon {
    display: inline-block;

    &.type-filled.tone-info,
    &.type-filled.tone-success,
    &.type-filled.tone-critical {
      fill: white;
    }
    &.type-filled.tone-warning {
      fill: $main-text-color;
    }

    &.type-filled.tone-info.disabled,
    &.type-filled.tone-success.disabled,
    &.type-filled.tone-warning.disabled,
    &.type-filled.tone-critical.disabled {
      fill: white;
    }

    &.type-outlined.tone-info {
      fill: $info-color;
    }
    &.type-outlined.tone-success {
      fill: $success-color;
    }
    &.type-outlined.tone-warning {
      fill: $warning-color;
    }
    &.type-outlined.tone-critical {
      fill: $critical-color;
    }

    &.type-outlined.tone-info.disabled,
    &.type-outlined.tone-success.disabled,
    &.type-outlined.tone-warning.disabled,
    &.type-outlined.tone-critical.disabled {
      fill: $disabled-color;
    }

    &.size-s {
      width: $text-font-size-m;
      height: $text-font-size-m;
      margin-right: $spacer-xs;
    }
    &.size-m {
      width: $text-font-size-m;
      height: $text-font-size-m;
      margin-right: $spacer-xs;
    }
    &.size-l {
      width: $text-font-size-l;
      height: $text-font-size-l;
      margin-right: $spacer-s;
    }
  }
</style>
