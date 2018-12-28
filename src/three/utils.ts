import { Object3D } from 'three'
import { ITile } from 'models/tile'

const translateToTile = (object: Object3D, tile: ITile) => {
  object.position.set(
    ((2 * tile.x + tile.z) * Math.sqrt(3)) / 2,
    tile.height / 2 || 1,
    (tile.z * 3) / 2
  )
}

export { translateToTile }
