import * as THREE from 'three'
import { IRegion } from 'models/region'
import { ICanvas } from 'models/canvas'
const InstancedMesh = require('three-instanced-mesh')(THREE)

class TileBuilder {
  region: IRegion
  private terrains: any = {
    dirt: new THREE.Color(0x007b0c),
    stone: new THREE.Color(0x666666),
    sand: new THREE.Color(0xc2b280),
    water: new THREE.Color(0x40a4df),
    forest: new THREE.Color(0x004b0c)
  }

  constructor(region: IRegion) {
    this.region = region
  }

  async call(store: ICanvas) {
    const geometry = new THREE.CylinderBufferGeometry(1, 1, 1, 6)
    const material = new THREE.MeshLambertMaterial({
      flatShading: true
    })

    //the instance group
    const mesh = new InstancedMesh(
      geometry, //this is the same
      material,
      this.region.tiles.length, //instance count
      false, //is it dynamic
      true, //does it have color
      false
    )

    const vector = new THREE.Vector3()
    let index = 0
    this.region.tiles.forEach(tile => {
      mesh.setColorAt(index, this.terrains[tile.terrain.type])
      mesh.setPositionAt(
        index,
        vector.set(
          ((2 * tile.x + tile.z) * Math.sqrt(3)) / 2,
          Math.max(tile.height / 2, 1),
          (tile.z * 3) / 2
        )
      )
      mesh.setScaleAt(index, vector.set(1, Math.max(tile.height, 1), 1))
      index++
    })

    store.scene.add(mesh)
    store.animate()

    this.region.markRendered()
  }
}

export default TileBuilder
