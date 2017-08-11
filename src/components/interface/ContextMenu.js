import React, {Component} from 'react'
import {observer} from 'mobx-react'
import styles from 'styles/components/interface/ContextMenu.scss'
import interfaceStore from 'stores/interfaceStore'
import autobind from 'autobind-decorator'

@observer
class ContextMenu extends Component {
  @autobind
  plantTree() {
    interfaceStore.build('forest')
  }

  render() {
    const { tile } = interfaceStore.contextMenu

    return (
        <div className={styles['context-menu']}>
          <p>Coordinates: { tile.x } { tile.y } { tile.z }</p>
          <p>Terrain type: { tile.terrain.type }</p>
          <p>Object type: { tile.object && tile.object.type }</p>
          <a onClick={this.plantTree}>Plant tree</a>
        </div>
    )
  }
}

export default ContextMenu