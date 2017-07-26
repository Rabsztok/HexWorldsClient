require('styles/world.scss');

import React, {Component} from 'react';
import {observer} from 'mobx-react';
import playerStore from 'stores/playerStore'
import worldStore from 'stores/worldStore';
import canvasStore from 'stores/canvasStore';
import Canvas from 'components/Canvas';

@observer
export default class WorldPage extends Component {
  componentDidMount() {
    canvasStore.setCanvasSize(window.innerWidth, window.innerHeight)
  }

  componentDidUpdate() {
    canvasStore.setCanvasSize(window.innerWidth, window.innerHeight)
  }

  render() {
    let id = this.props.match.params.topicId;
    let world = worldStore.world(id);

    if (world)
      return (
          <div>
            { playerStore.loading && <div className="loading"><i className="fa fa-circle-o-notch fa-spin"/></div> }
            <div className="canvas-container" id="canvas-container">
              <Canvas width={canvasStore.canvasWidth} height={canvasStore.canvasHeight} />
            </div>
          </div>
      );
    else
      return null
  }
}
