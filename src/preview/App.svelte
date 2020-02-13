<script>
  import Router from 'svelte-spa-router'
  import Top from './routes/Top.svelte'
  import Container from './routes/Container.svelte'

  const routes = {
    '/': Top,
    '/container': Container,
  }
</script>

<Router {routes} />
