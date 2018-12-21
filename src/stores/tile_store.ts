import { observable, action } from 'mobx'
import { differenceBy } from 'lodash'
import { distance } from 'utils/coordinates'
import { ceilAndFloor } from 'utils/math'
import Tile from 'models/tile'
import Channel from 'channel'
import World from 'models/world'
import { Vector3 } from 'three'

class TileStore {
  @observable tiles: Tile[]
  world: World
  channel: Channel
  tileMatrix: Map<string, Tile>

  constructor(world: World) {
    this.world = world
    this.tiles = []
    this.tileMatrix = new Map()
    this.channel = new Channel('tiles:lobby')
  }

  connect(): void {
    if (this.channel.connected) return

    this.channel.connect(
      { world_id: this.world.id },
      { onSuccess: this.onTilesLoaded }
    )
    this.channel.socket.on('move', this.onTilesLoaded)
  }

  onTilesLoaded = (response: { tiles: Tile[] }): void => {
    this.addTiles(response.tiles)
  }

  @action
  addTiles(tiles: Tile[]): void {
    const newTiles = differenceBy(tiles, this.tiles.slice(), 'id').map(
      tile => new Tile(tile)
    )

    if (newTiles.length) {
      this.tiles = this.tiles.concat(newTiles)
      newTiles.forEach(this.add)
      this.calculateHeightMap(newTiles)
    }
  }

  add = (tile: Tile): void => {
    const { x, y, z } = tile
    this.tileMatrix.set([x, y, z].join(','), tile)
  }

  find(x: number, y: number, z: number): Tile | undefined {
    return this.tileMatrix.get([x, y, z].join(','))
  }

  getHeightDifference(tile: Tile, x: number, y: number, z: number): number {
    const neighbor = this.find(tile.x + x, tile.y + y, tile.z + z)

    return neighbor
      ? tile.renderHeight - neighbor.renderHeight
      : tile.renderHeight
  }

  nearest = (vector: Vector3): Tile | undefined => {
    let nearestTile: Tile | undefined
    let nearestDistance: number | undefined

    // TODO: optimize
    ceilAndFloor(vector.x).map(x =>
      ceilAndFloor(vector.y).map(y =>
        ceilAndFloor(vector.z).map(z => {
          const tile = this.find(x, y, z)

          if (tile) {
            if (!nearestTile || !nearestDistance) {
              nearestTile = tile
              nearestDistance = distance(vector, tile)
            } else {
              const currentDistance = distance(vector, tile)
              if (currentDistance < nearestDistance) {
                nearestTile = tile
                nearestDistance = currentDistance
              }
            }
          }

          return tile
        })
      )
    )

    return nearestTile
  }

  @action
  calculateHeightMap(tiles: Tile[]): void {
    tiles.forEach(tile => {
      tile.heightMap = tile.heightMap || {
        xz: this.getHeightDifference(tile, -1, 0, 1),
        yz: this.getHeightDifference(tile, 0, -1, 1),
        yx: this.getHeightDifference(tile, 1, -1, 0),
        zx: this.getHeightDifference(tile, 0, 1, -1),
        zy: this.getHeightDifference(tile, 1, 0, -1),
        xy: this.getHeightDifference(tile, -1, 1, 0)
      }
    })
  }

  move(coordinates: Vector3): void {
    this.channel.socket.push('move', {
      world_id: this.world.id,
      coordinates: coordinates,
      range: 50
    })
  }

  showAll(): void {
    this.channel.socket.push('move', {
      world_id: this.world.id,
      coordinates: { x: 0, y: 0, z: 0 },
      range: 10000
    })
  }
}

export default TileStore
