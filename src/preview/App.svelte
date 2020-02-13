<script>
  import { Container, Stack, Text } from '../../'
</script>

<Stack gap="m">
  <div class="bordered">
    <Container padding="s">
      <Text font="sans">Sans text in S padding Container</Text>
    </Container>
  </div>
  <div class="bordered">
    <Container padding="m">
      <Text font="serif">Serif text in M padding Container</Text>
    </Container>
  </div>
  <div class="bordered">
    <Container padding="l">
      <Text font="mono">Mono text in L padding Container</Text>
    </Container>
  </div>
</Stack>

<style>
  .bordered {
    border: solid 1px #222;
  }
</style>
