import React from 'react'
import { shallow } from 'enzyme'

import { WorldsPage } from 'components/pages/worlds_page'
import world from '__mocks__/world.mock.js'

describe('WorldsPage', () => {
  let store: any

  beforeEach(() => {
    store = {
      worldStore: {
        worldsList: [world],
        expand: jest.fn,
        remove: jest.fn
      }
    }
  })

  it('renders without errors', () => {
    const component = shallow(<WorldsPage store={store} />)
    expect(component).toMatchSnapshot()
  })
})
