import React, {Component} from 'react'
import {observer, inject} from 'mobx-react'
import Canvas from 'components/canvas'
import Menu from 'components/canvas_menu/canvas_menu'
import {CircularProgress} from '@material-ui/core'
import styles from './world.scss'

class WorldPage extends Component {
  UNSAFE_componentWillMount() {
    const {worldStore} = this.props.store

    const id = this.props.match.params.id
    const world = worldStore.worlds.get(id)

    worldStore.selectWorld(world)
  }

  componentWillUnmount() {
    this.props.store.worldStore.discardWorld()
  }

  render() {
    const {gridStore} = this.props.store.worldStore

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