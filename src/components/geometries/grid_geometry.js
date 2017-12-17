import * as THREE from 'three'
import autobind from 'autobind-decorator'
// import tileStore from 'stores/tile_store'

export default class GridGeometry extends THREE.BufferGeometry {
  fromTerrain(tiles, terrain) {
    const tmpGeometry = new THREE.Geometry()

    this.topGeometry = new THREE.CircleBufferGeometry(1, 6)
    this.topGeometry.attributes.uv.array[5] = 0.5
    this.topGeometry.attributes.uv.array[7] = 0.5
    this.topGeometry.rotateX(-Math.PI / 2)
    this.topGeometry.rotateY(Math.PI / 2)

    this.zxGeometry = new THREE.PlaneBufferGeometry(1, 1)
    this.zxGeometry.attributes.uv.array[1] = 0.5
    this.zxGeometry.attributes.uv.array[3] = 0.5
    this.zxGeometry.translate(0, -0.5, Math.sqrt(3) / 2)
    this.zxGeometry.rotateY(-Math.PI * 5 / 6)

    this.zyGeometry = new THREE.PlaneBufferGeometry(1, 1)
    this.zyGeometry.attributes.uv.array[1] = 0.5
    this.zyGeometry.attributes.uv.array[3] = 0.5
    this.zyGeometry.translate(0, -0.5, Math.sqrt(3) / 2)
    this.zyGeometry.rotateY(Math.PI * 5 / 6)

    this.yxGeometry = new THREE.PlaneBufferGeometry(1, 1)
    this.yxGeometry.attributes.uv.array[1] = 0.5
    this.yxGeometry.attributes.uv.array[3] = 0.5
    this.yxGeometry.translate(0, -0.5, Math.sqrt(3) / 2)
    this.yxGeometry.rotateY(Math.PI / 2)

    this.yzGeometry = new THREE.PlaneBufferGeometry(1, 1)
    this.yzGeometry.attributes.uv.array[1] = 0.5
    this.yzGeometry.attributes.uv.array[3] = 0.5
    this.yzGeometry.translate(0, -0.5, Math.sqrt(3) / 2)
    this.yzGeometry.rotateY(Math.PI / 6)

    this.xzGeometry = new THREE.PlaneBufferGeometry(1, 1)
    this.xzGeometry.attributes.uv.array[1] = 0.5
    this.xzGeometry.attributes.uv.array[3] = 0.5
    this.xzGeometry.translate(0, -0.5, Math.sqrt(3) / 2)
    this.xzGeometry.rotateY(-Math.PI / 6)

    this.xyGeometry = new THREE.PlaneBufferGeometry(1, 1)
    this.xyGeometry.attributes.uv.array[1] = 0.5
    this.xyGeometry.attributes.uv.array[3] = 0.5
    this.xyGeometry.translate(0, -0.5, Math.sqrt(3) / 2)
    this.xyGeometry.rotateY(-Math.PI / 2)

    tiles.map((tile) => this.generateTile(tmpGeometry, tile, terrain))

    this.fromGeometry(tmpGeometry)
    this.computeBoundingSphere()
    return this
  }

  @autobind
  generateTile(tmpGeometry, tile, terrain) {
    if (tile.terrain.type === terrain) {
      this.mergeGeometry(tmpGeometry, this.topGeometry, tile)
      this.mergeGeometry(tmpGeometry, this.xzGeometry, tile, {x: -1, y: 0, z: 1})
      this.mergeGeometry(tmpGeometry, this.yzGeometry, tile, {x: 0, y: -1, z: 1})
      this.mergeGeometry(tmpGeometry, this.yxGeometry, tile, {x: 1, y: -1, z: 0})
      this.mergeGeometry(tmpGeometry, this.zxGeometry, tile, {x: 0, y: 1, z: -1})
      this.mergeGeometry(tmpGeometry, this.zyGeometry, tile, {x: 1, y: 0, z: -1})
      this.mergeGeometry(tmpGeometry, this.xyGeometry, tile, {x: -1, y: 1, z: 0})
    }

    return tile
  }

  mergeGeometry(tmpGeometry, bufferGeometry, tile, side) {
    let matrix = new THREE.Matrix4()

    matrix.makeTranslation(
        ( 2 * tile.x + tile.z) * Math.sqrt(3) / 2,
        tile.height / 2 || 1,
        tile.z * 3 / 2
    )

    let height = 1
    if (side)
      height = tile.height - this.getHeight(tile.x + side.x, tile.y + side.y, tile.z + side.z)

    if (height >= 1) {
      let geometry = new THREE.Geometry().fromBufferGeometry(bufferGeometry)
      geometry.scale(1, height / 2, 1)
      tmpGeometry.merge(geometry, matrix)
    }
  }

  getHeight(x, y, z) {
    // try {
    //   return tileStore.find(x, y, z).height
    // } catch (_err) {
      return 0
    // }
  }
}

