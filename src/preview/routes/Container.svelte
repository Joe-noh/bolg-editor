<script>
  import { Container, Stack, Text, CodeBlock } from '../../'

  const code = `
<Stack gap="m" padding="m">
  <div></div>
  <div></div>
</Stack>

<Container padding="s">
  <div></div>
</Container>
  `.trim()
</script>

<Stack gap="m" padding="m">
  <div class="bordered">
    <Container padding="s">
      <Text font="sans">Hello from S padding Container</Text>
    </Container>
  </div>
  <div class="bordered">
    <Container padding="m">
      <Text font="sans">Hello from M padding Container</Text>
    </Container>
  </div>
  <div class="bordered">
    <Container padding="l">
      <Text font="sans">Hello from L padding Container</Text>
    </Container>
  </div>

  <CodeBlock {code} />
</Stack>

<style lang="scss">
  .bordered {
    border: solid 1px #222;
  }
</style>
