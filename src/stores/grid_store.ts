import {
  BufferGeometry,
  BufferAttribute,
  MeshLambertMaterial,
  Mesh
} from 'three'
import { chunk, each, groupBy } from 'lodash'
import Tile from 'models/tile'
import Grid from 'three/grid'
import { observable, autorun, computed, action } from 'mobx'

const { PLYLoader } = require('three/examples/js/loaders/PLYLoader')
const GridWorker = require('worker-loader!../workers/grid.worker')
const ForestWorker = require('worker-loader!../workers/forest.worker')

interface Job {
  worker: Worker
  tiles: Tile[]
  terrain: number // i think it's obsolete ToDo: refactor
}

class GridStore {
  private gridWorker = new GridWorker()
  private forestWorker = new ForestWorker()
  private terrains: any = {
    dirt: 0x007b0c,
    stone: 0x666666,
    sand: 0xc2b280,
    water: 0x40a4df,
    forest: 0x004b0c
  }
  @observable private queue: Job[] = []
  @observable private currentJobs = 0
  private maxJobs = 16
  public grid = new Grid()

  constructor() {
    this.gridWorker.onmessage = this.buildMesh
    this.forestWorker.onmessage = this.buildMesh

    autorun(this.runQueue)

    return this
  }

  @computed get loading(): boolean {
    return this.queue.length > 0 || this.currentJobs > 0
  }

  runQueue = () => {
    if (this.queue.length && this.currentJobs < this.maxJobs) {
      const job = this.queue.shift()

      if (job) {
        const { worker, tiles, terrain } = job
        worker.postMessage({ tiles: tiles.slice(), terrain })
        this.currentJobs += 1
      }
    }
  }

  // Set up WebWorkers and add them to query.
  @action
  draw(tiles: Tile[]): void {
    const groupedTiles = groupBy<Tile>(tiles, tile => tile.terrain.type)

    each(groupedTiles, (terrainTiles, terrainType) => {
      chunk(terrainTiles, 128).map(segment =>
        this.queue.push({
          worker: this.gridWorker,
          tiles: segment,
          terrain: this.terrains[terrainType]
        })
      )
    })

    chunk(groupedTiles.forest, 64).map(segment =>
      this.queue.push({
        worker: this.forestWorker,
        tiles: segment,
        terrain: this.terrains.forest
      })
    )
  }

  // Build Mesh using geometry attributes and terrain color from worker response.
  // We can't simply import objects as they are, because they are not Transferable type.
  // Encoding/Parsing them using ObjectLoader as JSON works, but is very slow for this use case.
  // So for optimal speed, we just copy geometry buffer attributes into new, fresh BufferGeometry.
  @action
  buildMesh = ({ data: { terrain, data } }: { data: any }) => {
    const loader = new PLYLoader()

    this.grid.add(
      new Mesh(
        loader.parse(data),
        new MeshLambertMaterial({
          color: terrain,
          flatShading: true
        })
      )
    )

    this.currentJobs -= 1
  }
}

export default GridStore
