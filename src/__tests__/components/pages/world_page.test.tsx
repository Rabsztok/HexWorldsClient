import React from 'react'
import { shallow } from 'enzyme'
import { WorldPage } from 'components/pages/world_page'
import { spy } from 'sinon'
import Canvas from 'components/canvas'
import { CircularProgress } from '@material-ui/core'
import world from '__mocks__/world.mock.js'

const noop = () => {}

describe('WorldPage', () => {
  let store: any
  beforeEach(() => {
    store = {
      worldStore: {
        selectWorld: noop,
        discardWorld: noop,
        currentWorld: world,
        gridStore: { loading: false }
      }
    }
  })

  it('renders without errors', () => {
    store.worldStore.selectWorld = spy()
    const component = shallow(
      <WorldPage store={store} match={{ params: { id: '1' } }} />
    )

    expect(store.worldStore.selectWorld.calledWith('1')).toBe(true)
    expect(component.find(Canvas).exists()).toBe(true)
  })

  it('renders loading indicator when grid is being loaded', () => {
    store.worldStore.gridStore.loading = true
    const component = shallow(
      <WorldPage store={store} match={{ params: { id: '1' } }} />
    )

    expect(component.find(CircularProgress).exists()).toBe(true)
  })

  it('discards current world on page exit', () => {
    store.worldStore.discardWorld = spy()
    const component = shallow(
      <WorldPage store={store} match={{ params: { id: '1' } }} />
    )

    component.unmount()

    expect(store.worldStore.discardWorld.calledOnce).toBe(true)
  })
})
