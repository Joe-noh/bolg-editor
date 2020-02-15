import '@testing-library/jest-dom/extend-expect'

import { render } from '@testing-library/svelte'
import Comp from './Container.svelte'

test('renders contents in container', () => {
  const { getByText } = render(Comp)

  expect(getByText('Hello from S padding Container')).toBeInTheDocument()
  expect(getByText('Hello from M padding Container')).toBeInTheDocument()
  expect(getByText('Hello from L padding Container')).toBeInTheDocument()
})
