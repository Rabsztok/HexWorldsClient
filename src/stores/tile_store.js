import {observable, action} from 'mobx'
import {differenceBy} from 'lodash'
import {distance} from 'utils/coordinates'
import {ceilAndFloor} from 'utils/math'
import Tile from 'records/tile'
import autobind from 'autobind-decorator'
import TileChannel from '../channels/tile_channel'

class TileStore {
  @observable tiles = []
  tileMatrix = {}

  constructor(world) {
    this.world = world
    this.channel = new TileChannel('tiles:lobby')

    this.channel.connect(world, this.onTilesLoaded)
    this.channel.socket.on('move', this.onTilesLoaded)
  }

  @autobind
  onTilesLoaded(response) {
    this.pushTiles(response.tiles)
  }

  @action
  clear() {
    this.tiles = []
    this.tileMatrix = {}
  }

  @action pushTiles(tiles) {
    const newTiles  = differenceBy(tiles, this.tiles.peek(), 'id').map((tile) => new Tile(tile))

    if (newTiles.length) {
      this.tiles = this.tiles.concat(newTiles)
      newTiles.forEach((tile) => {
        const {x,y,z} = tile
        this.tileMatrix[[x,y,z]] = tile
      })
      this.calculateHeightMap(newTiles)
    }
  }

  find(x,y,z) {
    return this.tileMatrix[[x,y,z]]
  }

  getHeightDifference(tile, x, y, z) {
    const neighbor = this.find(tile.x + x, tile.y + y, tile.z + z)

    return neighbor ? tile.renderHeight - neighbor.renderHeight : tile.renderHeight
  }

  @autobind
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

  calculateHeightMap(tiles) {
    tiles.map((tile) =>
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
    this.channel.socket.push('move', {world_id: this.world.id, coordinates: coordinates, range: 50})
  }

  showAll() {
    this.channel.socket.push('move', {world_id: this.world.id, coordinates: {x: 0, y: 0, z: 0}, range: 10000})
  }
}

export default TileStore