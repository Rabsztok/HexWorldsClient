import * as THREE from 'three'
import autobind from 'autobind-decorator'
import TileGeometry from './tile_geometry'

export default class GridGeometry extends THREE.BufferGeometry {
  constructor(tiles) {
    super()

    const tmpGeometry = new THREE.Geometry()
    tiles.map((tile) => this.mergeTile(tmpGeometry, tile))
    this.fromGeometry(tmpGeometry)
    this.computeBoundingSphere()

    return this
  }

  @autobind
  mergeTile(tmpGeometry, tile) {
    const matrix = new THREE.Matrix4()

    matrix.makeTranslation(
        ( 2 * tile.x + tile.z) * Math.sqrt(3) / 2,
        tile.height / 2 || 1,
        tile.z * 3 / 2
    )

    const tileGeometry = new TileGeometry(tile)
    let geometry = new THREE.Geometry().fromBufferGeometry(tileGeometry)
    tmpGeometry.merge(geometry, matrix)
  }
}

