import * as THREE from 'three'
import autobind from 'autobind-decorator'
import {chunk, each, groupBy} from 'lodash'
import Grid from 'objects/grid'
import {observable, autorun} from 'mobx'

class GridStore {
  terrains = {dirt: 0x007B0C, stone: 0x666666, sand: 0xC2B280, water: 0x40A4DF, forest: 0x004B0C}
  grid = new Grid()
  gridWorker = new Worker('/grid-worker.js')
  forestWorker = new Worker('/forest-worker.js')
  @observable queue = []
  @observable currentJobs = 0
  maxJobs = 16

  constructor() {
    this.gridWorker.onmessage = this.parseMesh
    this.forestWorker.onmessage = this.parseMesh

    autorun(this.runQueue)

    return this
  }

  @autobind
  runQueue() {
    if (this.queue.length && this.currentJobs < this.maxJobs) {
      const {worker, tiles, color} = this.queue.shift()
      worker.postMessage({tiles: tiles.slice(), color})
      this.currentJobs += 1
    }
  }

  draw(tiles) {
    const groupedTiles = groupBy(tiles, (tile) => tile.terrain.type)

    each(groupedTiles, (terrainTiles, terrainType) => {
      chunk(terrainTiles, 150).map((segment) => {
            console.log(segment.length)
            this.queue.push({
              worker: this.gridWorker,
              tiles: segment,
              color: this.terrains[terrainType]
            })
          }
      )
    })

    chunk(groupedTiles.forest, 50).map((segment) =>
      this.queue.push({ worker: this.forestWorker, tiles: segment })
    )
  }

  @autobind
  parseMesh(e) {
    const loader = new THREE.ObjectLoader()
    const mesh = loader.parse(e.data)

    this.grid.add(mesh)
    this.currentJobs -= 1
  }
}

export default GridStore