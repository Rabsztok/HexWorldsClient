import { CylinderGeometry, MeshLambertMaterial, Mesh } from 'three'
import Player from 'models/player'
import Tile from 'models/tile'
import CanvasStore from 'stores/canvas_store'
import { translateToTile } from 'three/utils'

class PlayerBuilder {
  player: Player
  tile: Tile

  constructor(tile: Tile, player: Player) {
    this.tile = tile
    this.player = player
  }

  async call(canvasStore: CanvasStore) {
    this.player.mesh = new Mesh(
      new CylinderGeometry(0.5, 0.5, 0.5),
      new MeshLambertMaterial({ color: 0x00ff00, flatShading: true })
    )

    translateToTile(this.player.mesh, this.tile)

    canvasStore.scene.add(this.player.mesh)
    canvasStore.animate()
  }
}

export default PlayerBuilder
