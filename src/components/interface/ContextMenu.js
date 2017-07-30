import React, {Component} from 'react'
import {observer} from 'mobx-react'
import styles from 'styles/components/interface/ContextMenu.scss'
import interfaceStore from 'stores/interfaceStore'

@observer
class ContextMenu extends Component {
  render() {
    const { tile, position } = interfaceStore.contextMenu
    const style = { left: position.x, top: position.y }
    return (
        <div className={styles['context-menu']} style={style}>
          { tile.x }, { tile.y }, { tile.z }
        </div>
    )
  }
}

export default ContextMenu