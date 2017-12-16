import React, {Component} from 'react'
import {observer} from 'mobx-react'
import tileStore from 'stores/tile_store'
import worldStore from 'stores/world_store'
import Canvas from 'components/canvas'
require('styles/world.scss')

@observer
export default class WorldPage extends Component {
  componentWillMount() {
    const world = worldStore.find(this.props.match.params.id)
    worldStore.selectWorld(world)
  }

  render() {
    if (worldStore.currentWorld) {
      return (
          <div>
            {tileStore.loading && <div className='loading'><i className='fa fa-circle-o-notch fa-spin'/></div>}
            <div className='canvas-container' id='canvas-container'>
              <Canvas/>
            </div>
          </div>
      )
    }
    else return null
  }
}
