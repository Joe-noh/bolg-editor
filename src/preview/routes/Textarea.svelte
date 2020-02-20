<script>
  import { Container, Stack, Textarea, CodeBlock } from '../../'

  let value = ''
  const code = `
<Textarea label="Textarea" rows="3" placeholder="Multi line text here" bind:value />
<Textarea tone="critical" message="Something went wrong!" bind:value />
  `.trim()
</script>

<Container padding="m">
  <Stack gap="m">
    <Textarea label="Textarea" bind:value message="value: {value}" />
    <Textarea label="Success tone" tone="success" message="Good!" placeholder="with placeholder" value="" />
    <Textarea label="Critical tone" tone="critical" message="This cannot be blank!!" />
    <CodeBlock {code} />
  </Stack>
</Container>
