<script>
  import { Stack, Heading, CodeBlock } from '../../'

  const code = `
<Heading level="1">Heading 1</Heading>
<Heading level="2">Heading 2</Heading>
<Heading level="3">Heading 3</Heading>
<Heading level="4">Heading 4</Heading>
<Heading level="5">Heading 5</Heading>
  `.trim()
</script>

<Stack gap="m">
  <Heading level="1">Heading 1</Heading>
  <Heading level="2">Heading 2</Heading>
  <Heading level="3">Heading 3</Heading>
  <Heading level="4">Heading 4</Heading>
  <Heading level="5">Heading 5</Heading>

  <CodeBlock {code} />
</Stack>
