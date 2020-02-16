<script>
  export let code
</script>

<div class="code-block">
  <pre class="pre">
    <code class="code">{code}</code>
  </pre>
</div>

<style lang="scss">
  @import 'variables.scss';

  .code-block {
    background-color: $main-text-color;
    color: white;
  }
  .pre {
    margin: 0;
    padding: $spacer-m;
  }
  .code {
    font-size: $text-font-size-s;
    font-family: $font-family-mono;
    line-height: 1.5;
  }
</style>
