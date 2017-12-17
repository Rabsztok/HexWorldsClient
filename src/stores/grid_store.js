import {observable, autorun, action} from 'mobx'
import {each} from 'lodash'
import GridGeometry from 'components/geometries/grid_geometry'
import ForestGeometry from 'components/geometries/forest_geometry'
import autobind from 'autobind-decorator'
import * as  THREE from 'three'

class GridStore {
  grid
  terrains = {dirt: 0x007B0C, stone: 0x666666, sand: 0xC2B280, water: 0x40A4DF, forest: 0x004B0C}
  @observable gridTiles = []

  setGrid() {
    this.grid = new THREE.Group()

    autorun(this.draw)

    return this.grid
  }
}

export default GridStore