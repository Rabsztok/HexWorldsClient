import React, {Component} from 'react'
import {observer, inject} from 'mobx-react'
import Canvas from 'components/canvas'
import Menu from 'components/canvas_menu/canvas_menu'
import {CircularProgress} from '@material-ui/core'
import styles from './world.scss'

class WorldPage extends Component {
  constructor(props) {
    super(props)
    const {worldStore} = props.store
    const id = props.match.params.id

    worldStore.selectWorld(id)
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

export { WorldPage }
export default inject('store')(observer(WorldPage))