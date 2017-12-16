import {observable, autorun, action} from 'mobx'
import {each} from 'lodash'
import tileStore from 'stores/tile_store'
import GridGeometry from 'components/geometries/grid_geometry'
import ForestGeometry from 'components/geometries/forest_geometry'
import autobind from 'autobind-decorator'
import * as  THREE from 'three'

class GridStore {
  terrains = {dirt: 0x007B0C, stone: 0x666666, sand: 0xC2B280, water: 0x40A4DF, forest: 0x004B0C}
  @observable grid

  @autobind
  draw() {
    this.grid.children.map((mesh) => this.grid.remove(mesh))

    each(this.terrains, (color, terrain) => {
      const mesh = new THREE.Mesh(
          new GridGeometry().fromTerrain(tileStore.tiles, terrain),
          new THREE.MeshLambertMaterial({color: color, flatShading: true})
      )
      this.grid.add(mesh)
    })

    // draw forest
    const mesh = new THREE.Mesh(
        new ForestGeometry().build(tileStore.tiles),
        new THREE.MeshLambertMaterial( { color: 0x002B0C, flatShading: true } )
    )
    this.grid.add(mesh)
  }

  @action
  setGrid() {
    this.grid = new THREE.Group()

    autorun(this.draw)

    return this.grid
  }
}

const gridStore = new GridStore()

window.GridStore = gridStore

export default gridStore