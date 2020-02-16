<script>
  import { Container, Stack, TextField } from '../../'

  let value = ''
</script>

<Container padding="m">
  <Stack gap="m">
    <TextField label="Text Field" bind:value message="value: {value}" />
    <TextField label="Text Field" tone="success" message="Good!" value="" />
    <TextField label="Text Field" tone="critical" message="This cannot be blank!!" />
  </Stack>
</Container>
