import '@testing-library/jest-dom/extend-expect'

import { render, fireEvent } from '@testing-library/svelte'
import Comp from './Button.svelte'

test('handle on:click', async () => {
  const { getByText } = render(Comp)

  await fireEvent.click(getByText('Filled info'))
  expect(getByText('Filled info clicked')).toBeInTheDocument()

  await fireEvent.click(getByText('Filled success'))
  expect(getByText('Filled success clicked')).toBeInTheDocument()

  await fireEvent.click(getByText('Filled warning'))
  expect(getByText('Filled warning clicked')).toBeInTheDocument()

  await fireEvent.click(getByText('Filled critical'))
  expect(getByText('Filled critical clicked')).toBeInTheDocument()

  await fireEvent.click(getByText('Outlined info'))
  expect(getByText('Outlined info clicked')).toBeInTheDocument()

  await fireEvent.click(getByText('Outlined success'))
  expect(getByText('Outlined success clicked')).toBeInTheDocument()

  await fireEvent.click(getByText('Outlined warning'))
  expect(getByText('Outlined warning clicked')).toBeInTheDocument()

  await fireEvent.click(getByText('Outlined critical'))
  expect(getByText('Outlined critical clicked')).toBeInTheDocument()
})
