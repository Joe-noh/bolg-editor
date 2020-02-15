<script>
  import Router from 'svelte-spa-router'
  import Top from './routes/Top.svelte'
  import Colors from './routes/Colors.svelte'
  import Heading from './routes/Heading.svelte'
  import Container from './routes/Container.svelte'
  import Button from './routes/Button.svelte'

  const routes = {
    '/': Top,
    '/colors': Colors,
    '/heading': Heading,
    '/container': Container,
    '/button': Button,
  }
</script>

<Router {routes} />
