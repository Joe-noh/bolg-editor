<script>
  export let level = 1

  const headingLevel = +level
</script>

{#if headingLevel === 1}
  <h1 class="heading {`heading--${headingLevel}`}">
    <slot />
  </h1>
{:else if headingLevel === 2}
  <h2 class="heading {`heading--${headingLevel}`}">
    <slot />
  </h2>
{:else if headingLevel === 3}
  <h3 class="heading {`heading--${headingLevel}`}">
    <slot />
  </h3>
{:else if headingLevel === 4}
  <h4 class="heading {`heading--${headingLevel}`}">
    <slot />
  </h4>
{:else if headingLevel === 5}
  <h5 class="heading {`heading--${headingLevel}`}">
    <slot />
  </h5>
{/if}

<style lang="scss">
  @import 'variables.scss';

  .heading {
    margin: 0;
    color: $main-text-color;
    font-family: $font-family-sans;
    font-weight: bold;
  }

  .heading--1 {
    font-size: $heading-font-size-1;
  }
  .heading--2 {
    font-size: $heading-font-size-2;
  }
  .heading--3 {
    font-size: $heading-font-size-3;
  }
  .heading--4 {
    font-size: $heading-font-size-4;
  }
  .heading--5 {
    font-size: $heading-font-size-5;
  }
</style>
