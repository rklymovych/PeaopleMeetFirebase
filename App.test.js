import React from 'react'
import {render} from '@testing-library/react'
import App from './src/components/App'

test('render learn react fragment', () => {
  const {getByText} = render(<App/>)
  const linkElement = getByText(/learn react/i)
  expect(linkElement).toBeInTheDocument()

})