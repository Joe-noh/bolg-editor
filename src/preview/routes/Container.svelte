<script>
  import { Container, Stack, Text } from '../../'
</script>

<Stack gap="m">
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
</Stack>

<style lang="scss">
  .bordered {
    border: solid 1px #222;
  }
</style>
