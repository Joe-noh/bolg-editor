import '@testing-library/jest-dom/extend-expect'

import { render } from '@testing-library/svelte'
import Comp from './Heading.svelte'

test('renders slot content', () => {
  const { getByText } = render(Comp)

  expect(getByText('Heading 1')).toBeInTheDocument()
  expect(getByText('Heading 2')).toBeInTheDocument()
  expect(getByText('Heading 3')).toBeInTheDocument()
  expect(getByText('Heading 4')).toBeInTheDocument()
  expect(getByText('Heading 5')).toBeInTheDocument()
})
