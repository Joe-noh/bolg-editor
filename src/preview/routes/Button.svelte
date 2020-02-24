<script>
  import { GithubIcon, AlertCircleOutlineIcon } from 'svelte-eva-icons'
  import { Container, Stack, Button, CodeBlock } from '../../'

  let message = ''
  const code = `
<Button tone="info" type="filled">Press</Button>
<Button tone="critical" type="outlined">Press</Button>
<Button disabled>Disabled</Button>

<!-- svelte-eva-icons supported -->
<Button tone="info" type="filled" icon="{EditIcon}">Edit</Button>
  `.trim()

  function show(msg) {
    return event => {
      message = msg
    }
  }
</script>

<Container padding="m">
  <Stack gap="m">
    <Stack gap="s">
      <span>
        <Button tone="info" type="filled" on:click="{show('Filled info clicked')}">Filled info</Button>
      </span>
      <span>
        <Button tone="success" type="filled" on:click="{show('Filled success clicked')}">Filled success</Button>
      </span>
      <span>
        <Button tone="warning" type="filled" on:click="{show('Filled warning clicked')}">Filled warning</Button>
      </span>
      <span>
        <Button tone="critical" type="filled" on:click="{show('Filled critical clicked')}">Filled critical</Button>
      </span>
    </Stack>

    <Stack gap="s">
      <span>
        <Button tone="info" type="outlined" on:click="{show('Outlined info clicked')}">Outlined info</Button>
      </span>
      <span>
        <Button tone="success" type="outlined" on:click="{show('Outlined success clicked')}">Outlined success</Button>
      </span>
      <span>
        <Button tone="warning" type="outlined" on:click="{show('Outlined warning clicked')}">Outlined warning</Button>
      </span>
      <span>
        <Button tone="critical" type="outlined" on:click="{show('Outlined critical clicked')}">Outlined critical</Button>
      </span>
    </Stack>

    <Stack gap="s">
      <span>
        <Button disabled tone="info" type="filled">Disabled filled info</Button>
      </span>
      <span>
        <Button disabled tone="success" type="filled">Disabled filled success</Button>
      </span>
      <span>
        <Button disabled tone="warning" type="filled">Disabled filled warning</Button>
      </span>
      <span>
        <Button disabled tone="critical" type="filled">Disabled filled critical</Button>
      </span>
    </Stack>

    <Stack gap="s">
      <span>
        <Button disabled tone="info" type="outlined">Disabled outlined info</Button>
      </span>
      <span>
        <Button disabled tone="success" type="outlined">Disabled outlined success</Button>
      </span>
      <span>
        <Button disabled tone="warning" type="outlined">Disabled outlined warning</Button>
      </span>
      <span>
        <Button disabled tone="critical" type="outlined">Disabled outlined critical</Button>
      </span>
    </Stack>

    <Stack gap="s">
      <span>
        <Button tone="info" type="filled" icon="{GithubIcon}" on:click="{show('Filled info with icon clicked')}">GitHub</Button>
      </span>
      <span>
        <Button tone="critical" type="outlined" icon="{AlertCircleOutlineIcon}" on:click="{show('Outlined critical with icon clicked')}">Watch out!</Button>
      </span>
    </Stack>

    <span>{message}</span>

    <CodeBlock {code} />
  </Stack>
</Container>
