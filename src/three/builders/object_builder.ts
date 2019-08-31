import * as THREE from 'three'
import { IRegion } from 'models/region'
import { ICanvas } from 'models/canvas'
import { groupBy, each } from 'lodash'
import objectBuilders from './object_builders'
const InstancedMesh = require('three-instanced-mesh')(THREE)

class ObjectBuilder {
  region: IRegion

  constructor(region: IRegion) {
    this.region = region
  }

  // ToDO: Optimize it by re-rendering whole world as one instancedMesh, possibly separated by colors
  // colors option is giving some overhead here.
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
      true
    )

    const tilesWithObjects = this.region.tiles.filter(tile => tile.object)
    const groupedObjects = groupBy(tilesWithObjects, tile => tile.object.type)
    each(groupedObjects, (objects, type) =>
      new objectBuilders[type](objects).call(store)
    )

    store.scene.add(mesh)
    store.animate()

    this.region.markRendered()
  }
}

export default ObjectBuilder
