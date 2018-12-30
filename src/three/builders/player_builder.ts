import { CylinderGeometry, MeshLambertMaterial, Mesh } from 'three'
import Player from 'models/player'
import { ITile } from 'models/tile'
import { ICanvas } from 'models/canvas'
import { translateToTile } from 'three/utils'

class PlayerBuilder {
  player: Player
  tile: ITile

  constructor(tile: ITile, player: Player) {
    this.tile = tile
    this.player = player
  }

  async call(canvas: ICanvas) {
    this.player.mesh = new Mesh(
      new CylinderGeometry(0.5, 0.5, 0.5),
      new MeshLambertMaterial({ color: 0x00ff00, flatShading: true })
    )

    translateToTile(this.player.mesh, this.tile)

    canvas.scene.add(this.player.mesh)
    canvas.animate()
  }
}

export default PlayerBuilder
