import {observable, observe, action} from 'mobx'
import {differenceBy} from 'lodash'
import TileChannel from 'channels/tile_channel'
import {distance} from 'utils/coordinates'
import {ceilAndFloor} from 'utils/math'
import Tile from 'records/tile'

class TileStore {
  @observable loading = false
  @observable tiles = []
  @observable range = 5
  tileMatrix = {}

  constructor() {
    observe(this, 'tiles', this.computeTileMatrix.bind(this))
  }

  connect(world) {
    this.startLoading()
    this.channel = new TileChannel('tiles:lobby')

    this.channel.connect(world, this.onTilesLoaded.bind(this))
    this.channel.socket.on('move', this.onTilesLoaded.bind(this))
  }

  @action computeTileMatrix() {
    let tileMatrix = {}

    this.tiles.map((tile) => {
      if (!tileMatrix[tile.x]) tileMatrix[tile.x] = {}
      if (!tileMatrix[tile.x][tile.y]) tileMatrix[tile.x][tile.y] = {}
      tileMatrix[tile.x][tile.y][tile.z] = tile

      return tile
    })

    this.tileMatrix = tileMatrix
  }

  onTilesLoaded(response) {
    this.pushTiles(response.tiles)
    this.calculateHeightMap()
    this.stopLoading()
  }

  @action startLoading() {
    this.loading = true
  }

  @action stopLoading() {
    this.loading = false
  }

  @action pushTiles(tiles) {
    const newTiles  = differenceBy(tiles, this.tiles.peek(), 'id').map((tile) => new Tile(tile))

    if (newTiles.length)
      this.tiles = this.tiles.concat(newTiles)
  }

  find(x,y,z) {
    return this.tileMatrix && this.tileMatrix[x] && this.tileMatrix[x][y] && this.tileMatrix[x][y][z]
  }

  getHeightDifference(tile, x, y, z) {
    const neighbor = this.find(tile.x + x, tile.y + y, tile.z + z)

    return neighbor ? tile.height - neighbor.height : 1
  }

  nearest(vector) {
    let nearest = null

    // TODO: optimize
    ceilAndFloor(vector.x).map(x =>
      ceilAndFloor(vector.y).map(y =>
        ceilAndFloor(vector.z).map(z => {
          const tile = this.find(x,y,z)

          if (tile) {
            if (nearest === null)
              nearest = {distance: distance(vector, tile), tile: tile}
            else {
              const currentDistance = distance(vector, tile)
              if (currentDistance < nearest.distance)
                nearest = {distance: currentDistance, tile: tile}
            }
          }

          return tile
        })
      )
    )

    return nearest.tile
  }

  calculateHeightMap() {
    this.tiles.map((tile) =>
      tile.heightMap = tile.heightMap || {
        xz: this.getHeightDifference(tile, -1, 0, 1),
        yz: this.getHeightDifference(tile, 0, -1, 1),
        yx: this.getHeightDifference(tile, 1, -1, 0),
        zx: this.getHeightDifference(tile, 0, 1, -1),
        zy: this.getHeightDifference(tile, 1, 0, -1),
        xy: this.getHeightDifference(tile, -1, 1, 0)
      }
    )
  }

  move(coordinates) {
    this.startLoading()
    this.channel.socket.push('move', {coordinates: coordinates, range: this.range})
  }
}

export default TileStore