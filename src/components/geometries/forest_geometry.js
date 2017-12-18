import * as THREE from 'three'
import {times, filter} from 'lodash'
import {randomInt} from 'utils/random'

class ForestGeometry extends THREE.BufferGeometry {
  constructor(tiles) {
    super()

    const tmpGeometry = new THREE.Geometry()
    const forestTiles = filter(tiles, (tile) => tile.terrain.type === 'forest')

    forestTiles.map((tile) => {
      const rotation = Math.random() // TODO: from UUID
      const density = tile.terrain.density

      times(density, (i) =>
          this.mergeGeometry(tmpGeometry, this.treeGeometry((i + 1) / density, randomInt(1, 5), rotation), tile)
      )

      return tile
    })

    this.fromGeometry(tmpGeometry)
    this.computeBoundingSphere()
    return this
  }

  treeGeometry(position, segments, rotation) {
    const tmpGeometry = new THREE.Geometry()

    times(segments, (i) => {
      const segmentGeometry = new THREE.ConeBufferGeometry(1, 1.5, 4, 1)
      segmentGeometry.scale(0.3 - i * 0.05, 0.3 - i * 0.05, 0.3 - i * 0.05)
      segmentGeometry.rotateY(Math.random() * Math.PI)
      segmentGeometry.translate(0.5, 0.25 + 0.09 * i, 0)
      segmentGeometry.rotateY((rotation + position) * Math.PI * 2)

      const geometry = new THREE.Geometry().fromBufferGeometry(segmentGeometry)
      tmpGeometry.merge(geometry)
    })

    return tmpGeometry
  }

  mergeGeometry(tmpGeometry, geometry, tile) {
    const matrix = new THREE.Matrix4()

    matrix.makeTranslation(
        ( 2 * tile.x + tile.z) * Math.sqrt(3) / 2,
        tile.height/2 || 1,
        tile.z * 3 / 2
    )

    tmpGeometry.merge(geometry, matrix)
  }
}

export default ForestGeometry
