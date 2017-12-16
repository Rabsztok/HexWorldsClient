import React, {Component} from 'react'
import {observer} from 'mobx-react'
import tileStore from 'stores/tile_store'
import worldStore from 'stores/world_store'
import Canvas from 'components/canvas'
import Menu from 'components/canvas_menu/canvas_menu'
import styles from './world.scss'

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
            <Menu/>

            {tileStore.loading && <div className={styles.loading}><i className='fa fa-circle-o-notch fa-spin'/></div>}

            <div className={styles.container}>
              <Canvas/>
            </div>
          </div>
      )
    }
    else return null
  }
}
