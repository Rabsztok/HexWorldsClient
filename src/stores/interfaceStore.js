import {observable, action} from 'mobx'

class InterfaceStore {
  @observable currentTile
  @observable contextMenu = null

  @action selectTile(tile) {
    this.currentTile = tile
  }

  @action openContextMenu(event, tile) {
    this.contextMenu = { tile: tile, position: { x: event.clientX, y: event.clientY } }
  }

  @action closeContextMenu() {
    this.contextMenu = null
  }
}

const interfaceStore = new InterfaceStore()

window.InterfaceStore = interfaceStore

export default interfaceStore