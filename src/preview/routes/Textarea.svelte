<script>
  import { Container, Stack, Textarea, CodeBlock } from '../../'

  let value = ''
  const code = `
<Textarea label="Name" rows="3" bind:value />
<Textarea tone="critical" message="Something went wrong!" bind:value />
  `.trim()
</script>

<Container padding="m">
  <Stack gap="m">
    <Textarea label="Textarea" bind:value message="value: {value}" />
    <Textarea label="Success tone" tone="success" message="Good!" value="" />
    <Textarea label="Critical tone" tone="critical" message="This cannot be blank!!" />
    <CodeBlock {code} />
  </Stack>
</Container>
