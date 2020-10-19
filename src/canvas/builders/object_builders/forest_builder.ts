import { Geometry, ConeBufferGeometry, Vector3, InstancedMesh, MeshLambertMaterial } from 'three'
import { times } from 'lodash'

import { randomInt } from 'utils/random'
import { ICanvas } from 'models/canvas'
import TileObject from 'models/tile_object'
import Tile from 'models/tile'

class ForestBuilder {
  private index = 0
  objects: TileObject[]
  mesh: any

  constructor(objects: TileObject[]) {
    this.objects = objects
    this.mesh = new InstancedMesh(
      new ConeBufferGeometry(1, 1.5, 4, 1),
      new MeshLambertMaterial({
        color: 0x004b0c,
        flatShading: true
      }),
      this.objects.length
    )
  }

  addTree(tile: Tile, segments: number) {
    const tmpGeometry = new Geometry()

    times(segments, (i) => {
      this.mesh.setScaleAt(
        this.index,
        0.3 - i * 0.05,
        0.3 - i * 0.05,
        0.3 - i * 0.05
      )
      this.translateTo(tile, new Vector3(0.5, 0.25 + 0.09 * i, 0))
      this.index++
    })

    return tmpGeometry
  }

  translateTo(tile: Tile, offset: Vector3) {
    this.mesh.setPositionAt(
      this.index,
      new Vector3(
        ((2 * tile.x + tile.z) * Math.sqrt(3)) / 2,
        Math.max(tile.height / 2, 1),
        (tile.z * 3) / 2
      ).add(offset)
    )
  }

  async call(store: ICanvas) {
    this.objects.forEach((forest) => {
      const { density } = forest.properties

      times(density, () => {
        this.addTree(forest.tile, randomInt(1, 5))
      })
    })

    store.scene.add(this.mesh)
    store.animate()
  }
}

export default ForestBuilder
