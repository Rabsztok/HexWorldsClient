import { SphereGeometry, MeshLambertMaterial, Mesh } from 'three'
import Tile from 'models/tile'

class Player {
  tile: Tile
  geometry = new SphereGeometry(0.5, 12, 12)
  material = new MeshLambertMaterial({
    color: 0x666666,
    flatShading: true
  })

  constructor(tile: Tile) {
    this.tile = tile

    this.translate()
  }

  get mesh() {
    return new Mesh(this.geometry, this.material)
  }

  translate = () => {
    this.geometry.translate(
      ((2 * this.tile.x + this.tile.z) * Math.sqrt(3)) / 2,
      this.tile.height / 2 || 1,
      (this.tile.z * 3) / 2
    )
  }
}

export default Player
