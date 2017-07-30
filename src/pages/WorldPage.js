import React, {Component} from 'react'
import {observer} from 'mobx-react'
import tileStore from 'stores/tileStore'
import worldStore from 'stores/worldStore'
import canvasStore from 'stores/canvasStore'
import interfaceStore from 'stores/interfaceStore'
import ContextMenu from 'components/interface/ContextMenu'
import Canvas from 'components/Canvas'
require('styles/world.scss')

@observer
export default class WorldPage extends Component {
  componentDidMount() {
    canvasStore.setCanvasSize(window.innerWidth, window.innerHeight)
  }

  componentDidUpdate() {
    canvasStore.setCanvasSize(window.innerWidth, window.innerHeight)
  }

  render() {
    let id = this.props.match.params.topicId
    let world = worldStore.world(id)

    if (world)
      return (
          <div>
            { tileStore.loading && <div className='loading'><i className='fa fa-circle-o-notch fa-spin'/></div> }
            <div className='canvas-container' id='canvas-container'>
              <Canvas width={canvasStore.canvasWidth} height={canvasStore.canvasHeight} />
              { interfaceStore.contextMenu && <ContextMenu/> }
            </div>
          </div>
      )
    else
      return null
  }
}
