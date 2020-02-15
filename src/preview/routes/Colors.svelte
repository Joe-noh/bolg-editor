<script>
  import { Container, Stack, Heading, Text } from '../../'
</script>

<Container padding="m">
  <Stack gap="m">
    <Stack gap="s">
      <Text>Success</Text>
      <div class="palette palette--success"></div>
    </Stack>

    <Stack gap="s">
      <Text>Warning</Text>
      <div class="palette palette--warning"></div>
    </Stack>

    <Stack gap="s">
      <Text>Critical</Text>
      <div class="palette palette--critical"></div>
    </Stack>
  </Stack>
</Container>

<style>
  .palette {
    width: 100px;
    height: 30px;
  }
  .palette--success {
    background-color: #48bb78;
  }
  .palette--warning {
    background-color: #f9db59;
  }
  .palette--critical {
    background-color: #e53d3d;
  }
</style>
