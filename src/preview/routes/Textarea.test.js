import '@testing-library/jest-dom/extend-expect'

import { render, fireEvent } from '@testing-library/svelte'
import Comp from './Textarea.svelte'

test('binding', async () => {
  const { getByText, getByPlaceholderText } = render(Comp)

  const input = getByPlaceholderText('placeholder')

  await fireEvent.input(input, { target: { value: 'ABC' } })
  expect(getByText('value: ABC')).toBeInTheDocument()
})
