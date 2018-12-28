import { types, Instance, getParentOfType } from 'mobx-state-tree'
import Tile, { ITile } from 'models/tile'
import World from 'models/world'
import Channel from 'channel'

const Region = types
  .model('Region', {
    id: types.identifier,
    x: types.number,
    y: types.number,
    z: types.number,
    tiles: types.map(types.late(() => Tile)),
    state: types.string
  })
  .views(self => ({
    get tilesList(): ITile[] {
      return Array.from(self.tiles.values())
    },
    get tilesToRender() {
      return this.tilesList.filter(tile => !tile.rendered)
    },
    get world() {
      return getParentOfType(self, World)
    }
  }))
  .volatile(self => ({
    channel: new Channel(`tiles:${self.id}`)
  }))
  .actions(self => ({
    connect() {
      if (self.channel.connected) return

      self.channel.connect(
        { region_id: self.id },
        { onSuccess: () => console.log(`connected to region ${self.id}`) }
      )

      self.channel.connection.on('load', this.onLoad)
    },
    addTiles(tiles: ITile[]) {
      const tileMap = tiles.map(tile => [tile.id, tile])
      self.tiles.merge(tileMap)
      tiles.forEach(tile => {
        self.world.addTile(tile)
      })
    },
    onLoad({ tiles }: { tiles: ITile[] }) {
      this.addTiles(tiles)
      self.tiles.forEach(tile => tile.calculateHeightMap())
    }
  }))

export interface IRegion extends Instance<typeof Region> {}

export default Region
