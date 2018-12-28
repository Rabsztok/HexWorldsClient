import {
  CircleBufferGeometry,
  PlaneBufferGeometry,
  BufferGeometry,
  Geometry
} from 'three'

const topGeometry = new CircleBufferGeometry(1, 6)
topGeometry.attributes.uv.array[5] = 0.5
topGeometry.attributes.uv.array[7] = 0.5
topGeometry.rotateX(-Math.PI / 2)
topGeometry.rotateY(Math.PI / 2)

function sideGeometry() {
  const geometry = new PlaneBufferGeometry(1, 1)
  geometry.attributes.uv.array[1] = 0.5
  geometry.attributes.uv.array[3] = 0.5
  geometry.translate(0, -0.5, Math.sqrt(3) / 2)

  return geometry
}

const zxGeometry = sideGeometry().rotateY((-Math.PI * 5) / 6)
const zyGeometry = sideGeometry().rotateY((Math.PI * 5) / 6)
const yxGeometry = sideGeometry().rotateY(Math.PI / 2)
const yzGeometry = sideGeometry().rotateY(Math.PI / 6)
const xzGeometry = sideGeometry().rotateY(-Math.PI / 6)
const xyGeometry = sideGeometry().rotateY(-Math.PI / 2)

export default class TileGeometry extends BufferGeometry {
  constructor(tile) {
    super()

    const tmpGeometry = new Geometry()
    this.mergeGeometry(tmpGeometry, topGeometry, tile)
    this.mergeGeometry(tmpGeometry, xzGeometry, tile, 'xz')
    this.mergeGeometry(tmpGeometry, yzGeometry, tile, 'yz')
    this.mergeGeometry(tmpGeometry, yxGeometry, tile, 'yx')
    this.mergeGeometry(tmpGeometry, zxGeometry, tile, 'zx')
    this.mergeGeometry(tmpGeometry, zyGeometry, tile, 'zy')
    this.mergeGeometry(tmpGeometry, xyGeometry, tile, 'xy')

    this.fromGeometry(tmpGeometry)
    return this
  }

  mergeGeometry(tmpGeometry, bufferGeometry, tile, side) {
    const height = side ? tile.heightMap[side] : 1

    if (height >= 1) {
      const geometry = new Geometry().fromBufferGeometry(bufferGeometry)
      geometry.scale(1, height / 2, 1)
      tmpGeometry.merge(geometry)
    }
  }
}
