<script>
  export let font = 'sans'
</script>

<span class="text {`font-${font}`}">
  <slot />
</span>

<style>
  .stack {
    color: #222;
  }
  .font-sans {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji',
      'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
  }
  .font-serif {
    font-family: Georgia, Cambria, 'Times New Roman', Times, serif;
  }
  .font-mono {
    font-family: Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  }
</style>
