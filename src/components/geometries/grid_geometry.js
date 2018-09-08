import * as THREE from 'three'
import Tile from 'records/tile'
import TileGeometry from './tile_geometry'

export default class GridGeometry extends THREE.BufferGeometry {
  constructor(tiles) {
    super()

    const tmpGeometry = new THREE.Geometry()
    tiles.map((tile) => this.mergeTile(tmpGeometry, new Tile(tile)))
    this.fromGeometry(tmpGeometry)

    return this
  }

  mergeTile(tmpGeometry, tile) {
    const matrix = new THREE.Matrix4()

    matrix.makeTranslation(
        ( 2 * tile.x + tile.z) * Math.sqrt(3) / 2,
        tile.renderHeight / 2 || 1,
        tile.z * 3 / 2
    )

    const tileGeometry = new TileGeometry(tile)
    const geometry = new THREE.Geometry().fromBufferGeometry(tileGeometry)
    tmpGeometry.merge(geometry, matrix)
  }
}

