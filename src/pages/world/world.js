import React, {Component} from 'react'
import {observer, inject} from 'mobx-react'
import Canvas from 'components/canvas'
import Menu from 'components/canvas_menu/canvas_menu'
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
    tileStore.fetch(world, { coordinates: { x: 0, y: 0, z: 0 }, range: 100 })
  }

  render() {
    const {worldStore, tileStore} = this.props.store

    if (!worldStore.currentWorld) return null

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
}

export default inject('store')(observer(WorldPage))