import { BufferGeometry, Geometry, Matrix4 } from 'three'
import TileGeometry from './tile_geometry'
import Tile from 'models/tile'

export default class GridGeometry extends BufferGeometry {
  constructor(tiles) {
    super()

    const tmpGeometry = new Geometry()
    tiles.map(tile => this.mergeTile(tmpGeometry, Tile.create(tile)))
    this.fromGeometry(tmpGeometry)

    return this
  }

  mergeTile(tmpGeometry, tile) {
    const matrix = new Matrix4()

    matrix.makeTranslation(
      ((2 * tile.x + tile.z) * Math.sqrt(3)) / 2,
      tile.renderHeight / 2 || 1,
      (tile.z * 3) / 2
    )

    const tileGeometry = new TileGeometry(tile)
    const geometry = new Geometry().fromBufferGeometry(tileGeometry)
    tmpGeometry.merge(geometry, matrix)
  }
}
