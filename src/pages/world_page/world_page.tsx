import React from 'react'
import { observer, inject } from 'mobx-react'
import Canvas from 'components/canvas'
import Menu from 'components/canvas_menu/canvas_menu'
import { CircularProgress } from '@material-ui/core'
import styles from './world_page.module.scss'
import { StoreProps } from 'types'

interface Props {
  store: StoreProps
  match: { params: { id: string } }
}

class WorldPage extends React.Component<Props, {}> {
  componentDidMount() {
    const { worldStore } = this.props.store
    const id = this.props.match.params.id

    worldStore.selectWorld(id)
  }

  componentWillUnmount() {
    this.props.store.worldStore.discardWorld()
  }

  render() {
    const { gridStore, currentWorld } = this.props.store.worldStore

    if (!gridStore || !currentWorld) return null

    return (
      <React.Fragment>
        <Menu />

        {gridStore.loading && (
          <div className={styles.loading}>
            <CircularProgress size={50} thickness={5} />
          </div>
        )}

        <div className={styles.container}>
          <Canvas />
        </div>
      </React.Fragment>
    )
  }
}

export { WorldPage }
export default inject('store')(observer(WorldPage))
