import {observable, action} from 'mobx'

class InterfaceStore {
  @observable currentTile
  @observable contextMenu = null

  @action selectTile(tile) {
    this.currentTile = tile
  }

  @action openContextMenu(tile) {
    this.contextMenu = { tile: tile }
  }

  @action closeContextMenu() {
    this.contextMenu = null
  }

  @action build(type) {
    this.currentTile.setObject({ type: type })
  }
}

const interfaceStore = new InterfaceStore()

window.InterfaceStore = interfaceStore

export default interfaceStore