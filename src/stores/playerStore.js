import {observable, observe, action, computed} from 'mobx'
import {differenceBy} from 'lodash'
import PlayerChannel from 'channels/PlayerChannel'
import {distance} from 'utils/coordinates'
import {ceilAndFloor} from 'utils/math'

class PlayerStore {
  @observable loading = false
  @observable tiles = []
  @observable range = 3
  tileMatrix = {}

  constructor() {
    observe(this, 'tiles', this.computeTileMatrix.bind(this))
    observe(this, 'tiles', this.computeTileMatrix.bind(this))

    this.connect()
  }

  connect() {
    this.startLoading()
    this.channel = new PlayerChannel('player:lobby')

    this.channel.connect(this.onTilesLoaded.bind(this))
    this.channel.socket.on('move', this.onTilesLoaded.bind(this))
  }

  @action computeTileMatrix() {
    let tileMatrix = {}

    this.tiles.map((tile) => {
      if (!tileMatrix[tile.x]) tileMatrix[tile.x] = {}
      if (!tileMatrix[tile.x][tile.y]) tileMatrix[tile.x][tile.y] = {}
      tileMatrix[tile.x][tile.y][tile.z] = tile
    })

    this.tileMatrix = tileMatrix
  }

  onTilesLoaded(response) {
    this.pushTiles(response.tiles)
    this.stopLoading()
  }

  @action startLoading() {
    this.loading = true
  }

  @action stopLoading() {
    this.loading = false
  }

  @action pushTiles(tiles) {
    const uniqueTiles  = differenceBy(tiles, this.tiles.peek(), 'id')

    this.tiles = this.tiles.concat(uniqueTiles)
  }

  find(x,y,z) {
    return this.tileMatrix && this.tileMatrix[x] && this.tileMatrix[x][y] && this.tileMatrix[x][y][z]
  }

  nearest(vector) {
    let nearest = null

    ceilAndFloor(vector.x).map(x =>
      ceilAndFloor(vector.y).map(y =>
        ceilAndFloor(vector.z).map(z => {
          const tile = this.find(x,y,z)

          if (tile)
            if (nearest === null)
              nearest = { distance: distance(vector, tile), tile: tile }
            else {
              const currentDistance = distance(vector, tile)
              if (currentDistance < nearest.distance)
                nearest = { distance: currentDistance, tile: tile }
            }
        })
      )
    )

    console.log(vector, nearest)
    return nearest.tile
  }

  move(coordinates) {
    this.startLoading()
    this.channel.socket.push('move', {coordinates: coordinates, range: this.range})
  }
}

const playerStore = new PlayerStore()

window.PlayerStore = playerStore

export default playerStore