import {observable, action} from 'mobx'

class Tile {
  @observable object

  constructor(tile) {
    Object.assign(this, tile)
  }

  @action setObject(object) {
    this.object = object
  }
}

window.ATile = Tile

export default Tile