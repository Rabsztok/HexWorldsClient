import { Object3D, Vector3 } from 'three'

import Tile from 'models/tile'
import loadMesh from 'canvas/loadMesh'
import { ICanvas } from 'models/canvas'

interface Section {
  position: Vector3
  scale: Vector3
  rotation: number
}

class HouseBuilder {
  static sectionMesh: Object3D
  sections: Section[]
  rotation: number
  tile: Tile
  mesh = new Object3D()

  constructor({
    tile,
    sections,
    rotation
  }: {
    tile: Tile
    sections: Section[]
    rotation: number
  }) {
    this.tile = tile
    this.sections = sections
    this.rotation = rotation
  }

  static async getSectionMesh() {
    this.sectionMesh = this.sectionMesh || (await loadMesh('/mesh/house.gltf'))

    return this.sectionMesh.clone()
  }

  async call(canvas: ICanvas) {
    const sectionMeshes = await Promise.all(
      this.sections.map(async (section) => {
        const sectionMesh = await HouseBuilder.getSectionMesh()

        sectionMesh.position.copy(section.position)
        sectionMesh.scale.copy(section.scale)
        sectionMesh.rotateZ(section.rotation)
        return sectionMesh
      })
    )

    this.mesh.children.push(...sectionMeshes)

    this.translateToTile()

    canvas.scene.add(this.mesh)
    canvas.animate()
  }

  translateToTile = () => {
    this.mesh.position.set(
      ((2 * this.tile.x + this.tile.z) * Math.sqrt(3)) / 2,
      this.tile.height / 2 || 1,
      (this.tile.z * 3) / 2
    )
  }
}

export default HouseBuilder
