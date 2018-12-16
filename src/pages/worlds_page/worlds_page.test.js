import React from 'react'
import { shallow } from 'enzyme'
import { WorldsPage } from './worlds_page'
import world from 'mocks/world_mock.js'

describe('WorldsPage', () => {
  let store
  beforeEach(() => {
    store = {
      worldStore: {
        worldsList: [world],
        expand: window.noop,
        remove: window.noop
      }
    }
  })

  it('renders without errors', () => {
    const component = shallow(<WorldsPage store={store} />)
    expect(component).toMatchSnapshot()
  })
})
