import React from 'react'
import { shallow } from 'enzyme'

import { NotFoundPage } from 'components/pages/not_found_page'

describe('NotFoundPage', () => {
  it('renders without errors', () => {
    const component = shallow(<NotFoundPage />)
    expect(component).toMatchSnapshot()
  })
})
