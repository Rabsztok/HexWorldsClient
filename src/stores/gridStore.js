import {observable, observe, action} from 'mobx'
import {each} from 'lodash'
import playerStore from 'stores/playerStore'
import GridGeometry from 'components/geometries/GridGeometry'
import * as  THREE from 'three'

class GridStore {
  terrains = {dirt: 0x007B0C, stone: 0x666666, sand: 0xC2B280, water: 0x40A4DF}
  @observable grid

  draw() {
    each(this.terrains, (color, terrain) => {
      const mesh = new THREE.Mesh(
          new GridGeometry().fromTerrain(playerStore.tiles, terrain),
          new THREE.MeshLambertMaterial( { color: color, shading: THREE.FlatShading } )
      )
      this.grid.add(mesh)
    })
  }

  @action setGrid(grid) {
    this.grid = grid
    observe(playerStore, 'tiles', this.draw.bind(this))
  }
}

const gridStore = new GridStore()

window.GridStore = gridStore

export default gridStore