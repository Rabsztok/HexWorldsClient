import * as THREE from 'three'
import {chunk, each, groupBy} from 'lodash'
import Grid from 'objects/grid'
import {observable, autorun, computed} from 'mobx'

class GridStore {
  terrains = {dirt: 0x007B0C, stone: 0x666666, sand: 0xC2B280, water: 0x40A4DF, forest: 0x004B0C}
  grid = new Grid()
  gridWorker = new Worker('/grid-worker.js')
  forestWorker = new Worker('/forest-worker.js')
  @observable queue = []
  @observable currentJobs = 0
  maxJobs = 16

  constructor() {
    this.gridWorker.onmessage = this.buildMesh
    this.forestWorker.onmessage = this.buildMesh

    autorun(this.runQueue)

    return this
  }

  @computed get loading() {
    return this.queue.length || this.currentJobs > 0
  }

  runQueue = () => {
    if (this.queue.length && this.currentJobs < this.maxJobs) {
      const {worker, tiles, terrain} = this.queue.shift()
      worker.postMessage({tiles: tiles.slice(), terrain})
      this.currentJobs += 1
    }
  }

  // Set up WebWorkers and add them to query.
  draw(tiles) {
    const groupedTiles = groupBy(tiles, (tile) => tile.terrain.type)

    each(groupedTiles, (terrainTiles, terrainType) => {
      chunk(terrainTiles, 300).map((segment) =>
          this.queue.push({
            worker: this.gridWorker,
            tiles: segment,
            terrain: this.terrains[terrainType]
          })
      )
    })

    chunk(groupedTiles.forest, 50).map((segment) =>
      this.queue.push({
        worker: this.forestWorker,
        tiles: segment,
        terrain: this.terrains.forest
      })
    )
  }

  // Build Mesh using geometry attributes and terrain color from worker response.
  // We can't simply import objects as they are, because they are not Transferable type.
  // Encoding/Parsing them using THREE.ObjectLoader as JSON works, but is very slow for this use case.
  // So for optimal speed, we just copy geometry buffer attributes into new, fresh THREE.BufferGeometry.
  buildMesh = (e) => {
    const { terrain, ...geometryAttributes } = e.data

    let geometry = new THREE.BufferGeometry()
    each(geometryAttributes, (attr, key) =>
        geometry.attributes[key] = new THREE.BufferAttribute(attr.array, attr.itemSize, attr.normalized)
    )

    const material = new THREE.MeshLambertMaterial({ color: terrain, flatShading: true })
    const mesh = new THREE.Mesh(geometry, material)

    this.grid.add(mesh)
    this.currentJobs -= 1
  }
}

export default GridStore