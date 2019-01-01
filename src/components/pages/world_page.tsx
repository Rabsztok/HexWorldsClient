import React from 'react'
import { computed } from 'mobx'
import { observer, inject } from 'mobx-react'
import Canvas from 'components/canvas/world_canvas'
import Menu from 'components/canvas_menu'
import { CircularProgress } from '@material-ui/core'
import styles from 'styles/pages/world_page.module.scss'
import { StoreProps } from 'types'

interface Props {
  store?: StoreProps
  match?: { params: { id: string } }
}

class WorldPage extends React.Component<Props, {}> {
  @computed
  get world() {
    const { worldStore } = this.props.store!
    const id = this.props.match!.params.id

    if (id) return worldStore.find(id)
  }

  render() {
    if (!this.world) return null

    return (
      <React.Fragment>
        <Menu />

        {this.world.loading && (
          <div className={styles.loading}>
            <CircularProgress size={50} thickness={5} />
          </div>
        )}

        <div className={styles.container}>
          <Canvas world={this.world} />
        </div>
      </React.Fragment>
    )
  }
}

export { WorldPage }
export default inject('store')(observer(WorldPage))
