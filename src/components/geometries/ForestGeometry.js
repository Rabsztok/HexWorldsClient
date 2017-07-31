import * as THREE from 'three'
import {times} from 'lodash'
import tileStore from 'stores/tileStore'
import {randomInt} from 'utils/random'

export default class ForestGeometry extends THREE.BufferGeometry {
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

  fromTerrain(tiles) {
    const tmpGeometry = new THREE.Geometry()

    tiles.map((tile) => {
      if (tile.terrain_type === 'dirt') {
        const rotation = Math.random()
        const density = randomInt(2, 5)
        times(density, (i) => {
          this.mergeGeometry(tmpGeometry, this.treeGeometry((i + 1) / density, randomInt(1, 5), rotation), tile)
        })
      }
    })

    this.fromGeometry(tmpGeometry)
    this.computeBoundingSphere()
    return this
  }

  mergeGeometry(tmpGeometry, geometry, tile, side) {
    const matrix = new THREE.Matrix4()

    matrix.makeTranslation(
        ( 2 * tile.x + tile.z) * Math.sqrt(3) / 2,
        tile.height/2 || 1,
        tile.z * 3 / 2
    )

    let height = 1
    if (side)
      height = tile.height - this.getHeight(tile.x + side.x, tile.y + side.y, tile.z + side.z)

    if (height >= 1) {
      geometry.scale(1, height, 1)
      tmpGeometry.merge(geometry, matrix)
    }
  }

  getHeight(x, y, z) {
    try {
      return tileStore.find(x, y, z).height
    } catch (_err) {
      return 0
    }
  }
}

