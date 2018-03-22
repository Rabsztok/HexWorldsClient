import React, {Component} from 'react'
import {observer, inject} from 'mobx-react'
import Canvas from 'components/canvas'
import Menu from 'components/canvas_menu/canvas_menu'
import {CircularProgress} from 'material-ui/Progress'
import styles from './world.scss'

class WorldPage extends Component {
  componentWillMount() {
    this.load()
  }

  componentWillUnmount() {
    this.props.store.tileStore.clear()
  }

  async load() {
    const {worldStore, tileStore} = this.props.store
    const world = await worldStore.fetch(this.props.match.params.id)

    worldStore.selectWorld(world)
    tileStore.connect(world)
  }

  render() {
    const {worldStore, gridStore} = this.props.store

    if (!worldStore.currentWorld) return null

    return (
        <div>
          <Menu/>

          {gridStore.loading &&
            <div className={styles.loading}>
              <CircularProgress size={50} thickness={5}/>
            </div>
          }

          <div className={styles.container}>
            <Canvas/>
          </div>
        </div>
    )
  }
}

export default inject('store')(observer(WorldPage))