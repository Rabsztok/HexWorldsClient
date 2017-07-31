import {observable, observe, action} from 'mobx'
import {each} from 'lodash'
import tileStore from 'stores/tileStore'
import GridGeometry from 'components/geometries/GridGeometry'
import ForestGeometry from 'components/geometries/ForestGeometry'
import * as  THREE from 'three'

class GridStore {
  terrains = {dirt: 0x007B0C, stone: 0x666666, sand: 0xC2B280, water: 0x40A4DF}
  @observable grid

  draw() {
    this.grid.children.map((mesh) => this.grid.remove(mesh))

    each(this.terrains, (color, terrain) => {
      const mesh = new THREE.Mesh(
          new GridGeometry().fromTerrain(tileStore.tiles, terrain),
          new THREE.MeshLambertMaterial( { color: color, shading: THREE.FlatShading } )
      )
      this.grid.add(mesh)
    })

    const mesh = new THREE.Mesh(
        new ForestGeometry().fromTerrain(tileStore.tiles),
        new THREE.MeshLambertMaterial( { color: 0x003000, shading: THREE.FlatShading } )
    )
    this.grid.add(mesh)
  }

  @action setGrid(grid) {
    this.grid = grid
    observe(tileStore, 'tiles', this.draw.bind(this))
  }
}

const gridStore = new GridStore()

window.GridStore = gridStore

export default gridStore