<script>
  import { Container, Stack, TextField, CodeBlock } from '../../'

  let value = ''
  const code = `
<TextField label="Name" placeholder="John Doe" bind:value />
<TextField tone="critical" message="Something went wrong!" bind:value />
  `.trim()
</script>

<Container padding="m">
  <Stack gap="m">
    <TextField label="Text Field" placeholder="placeholder" bind:value message="value: {value}" />
    <TextField label="Success tone" tone="success" message="Good!" value="" />
    <TextField label="Critical tone" tone="critical" message="This cannot be blank!!" />
    <CodeBlock {code} />
  </Stack>
</Container>
