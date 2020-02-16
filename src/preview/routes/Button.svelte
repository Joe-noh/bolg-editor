<script>
  import { Container, Stack, Button } from '../../'

  let message = ''

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

    <span>{message}</span>
  </Stack>
</Container>
