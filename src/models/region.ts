import { types, Instance, getParent } from 'mobx-state-tree'
import Tile from 'models/tile'
import Channel from 'channel'
import { IWorld } from './world'

// Group of tiles, 7651 in total. Acts as an abstraction for larger chunks of land.
const Region = types
  .model('Region', {
    id: types.identifier,
    x: types.frozen(types.number),
    y: types.frozen(types.number),
    z: types.frozen(types.number),
    tiles: types.frozen<Tile[]>(),
    state: types.string,
    rendered: types.optional(types.boolean, false),
  })
  .views((self) => ({
    get world(): IWorld {
      return getParent(getParent(self))
    },
    get readyToRender() {
      return !!self.tiles
    },
  }))
  .volatile((self) => ({
    channel: new Channel(`tiles:${self.id}`),
  }))
  .actions((self) => ({
    connect() {
      if (self.channel.connected) return

      self.channel.connect(
        { region_id: self.id },
        { onSuccess: () => console.log(`connected to region ${self.id}`) }
      )

      self.channel.connection.on('load', this.onLoad)
    },
    addTiles(tiles: Tile[]) {
      self.tiles = tiles.map((tile) => {
        tile = new Tile(tile)
        self.world.addTile(tile)
        return tile
      })
    },
    onLoad({ tiles }: { tiles: Tile[] }) {
      this.addTiles(tiles)
    },
    markRendered() {
      self.rendered = true
    },
    reset() {
      self.rendered = false
    },
  }))

export interface IRegion extends Instance<typeof Region> {}

export default Region
