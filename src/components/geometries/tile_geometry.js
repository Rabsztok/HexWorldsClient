import * as THREE from 'three'

const topGeometry = new THREE.CircleBufferGeometry(1, 6)
topGeometry.attributes.uv.array[5] = 0.5
topGeometry.attributes.uv.array[7] = 0.5
topGeometry.rotateX(-Math.PI / 2)
topGeometry.rotateY(Math.PI / 2)

function sideGeometry() {
  const geometry = new THREE.PlaneBufferGeometry(1, 1)
  geometry.attributes.uv.array[1] = 0.5
  geometry.attributes.uv.array[3] = 0.5
  geometry.translate(0, -0.5, Math.sqrt(3) / 2)

  return geometry
}

const zxGeometry = sideGeometry().rotateY(-Math.PI * 5 / 6)
const zyGeometry = sideGeometry().rotateY(Math.PI * 5 / 6)
const yxGeometry = sideGeometry().rotateY(Math.PI / 2)
const yzGeometry = sideGeometry().rotateY(Math.PI / 6)
const xzGeometry = sideGeometry().rotateY(-Math.PI / 6)
const xyGeometry = sideGeometry().rotateY(-Math.PI / 2)

export default class TileGeometry extends THREE.BufferGeometry {
  constructor(tile) {
    super()

    const tmpGeometry = new THREE.Geometry()
    this.mergeGeometry(tmpGeometry, topGeometry, tile)
    this.mergeGeometry(tmpGeometry, xzGeometry, tile, {x: -1, y: 0, z: 1})
    this.mergeGeometry(tmpGeometry, yzGeometry, tile, {x: 0, y: -1, z: 1})
    this.mergeGeometry(tmpGeometry, yxGeometry, tile, {x: 1, y: -1, z: 0})
    this.mergeGeometry(tmpGeometry, zxGeometry, tile, {x: 0, y: 1, z: -1})
    this.mergeGeometry(tmpGeometry, zyGeometry, tile, {x: 1, y: 0, z: -1})
    this.mergeGeometry(tmpGeometry, xyGeometry, tile, {x: -1, y: 1, z: 0})

    this.fromGeometry(tmpGeometry)
    this.computeBoundingSphere()
    return this
  }

  mergeGeometry(tmpGeometry, bufferGeometry, tile, side) {
    const height = side ? tile.height - this.getHeight(tile.x + side.x, tile.y + side.y, tile.z + side.z) : 1

    if (height >= 1) {
      const geometry = new THREE.Geometry().fromBufferGeometry(bufferGeometry)
      geometry.scale(1, height / 2, 1)
      tmpGeometry.merge(geometry)
    }
  }

  getHeight(x, y, z) {
    try {
      return window.store.tileStore.find(x, y, z).height
    } catch (_err) {
      return 0
    }
  }
}

