import React from 'react'
import { shallow } from 'enzyme'
import { WorldPage } from 'components/pages/world_page'
import { spy, stub } from 'sinon'
import Canvas from 'components/canvas/world_canvas'
import { CircularProgress } from '@material-ui/core'
import world from '__mocks__/world.mock.js'

const noop = () => {}

describe('WorldPage', () => {
  let store: any
  beforeEach(() => {
    store = {
      worldStore: {
        find: stub().returns(world),
        loading: true
      }
    }
  })

  it('renders without errors', () => {
    const component = shallow(
      <WorldPage store={store} match={{ params: { id: '1' } }} />
    )

    expect(store.worldStore.find.calledWith('1')).toBe(true)
    expect(component.find(Canvas).exists()).toBe(true)
  })

  it('renders loading indicator when grid is being loaded', () => {
    const component = shallow(
      <WorldPage store={store} match={{ params: { id: '1' } }} />
    )

    expect(component.find(CircularProgress).exists()).toBe(true)
  })
})
