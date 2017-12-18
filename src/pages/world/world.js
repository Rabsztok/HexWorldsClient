import React, {Component} from 'react'
import {observer, inject} from 'mobx-react'
import Canvas from 'components/canvas'
import Menu from 'components/canvas_menu/canvas_menu'
import styles from './world.scss'

class WorldPage extends Component {
  componentWillMount() {
    this.load()
  }

  async load() {
    const {worldStore, tileStore} = this.props.store
    const world = await worldStore.fetch(this.props.match.params.id)
    console.log(world)
    worldStore.selectWorld(world)
    tileStore.connect(world)
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