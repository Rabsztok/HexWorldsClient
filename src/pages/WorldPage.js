import React, {Component} from 'react'
import {observer} from 'mobx-react'
import tileStore from 'stores/tileStore'
import worldStore from 'stores/worldStore'
import interfaceStore from 'stores/interfaceStore'
import ContextMenu from 'components/interface/ContextMenu'
import Canvas from 'components/Canvas'
require('styles/world.scss')

@observer
export default class WorldPage extends Component {
  componentWillMount() {
    const world = worldStore.find(this.props.match.params.topicId)
    worldStore.selectWorld(world)
  }

  render() {
    if (worldStore.currentWorld) {
      return (
          <div>
            {tileStore.loading && <div className='loading'><i className='fa fa-circle-o-notch fa-spin'/></div>}
            <div className='canvas-container' id='canvas-container'>
              <Canvas/>
              {interfaceStore.contextMenu && <ContextMenu/>}
            </div>
          </div>
      )
    }
    else return null
  }
}
