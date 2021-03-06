import { types, Instance, getParentOfType } from 'mobx-state-tree'

import Tile from 'models/tile'
import Channel from 'channel'

import World from './world'

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
        getParentOfType(self, World).addTile(tile)
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
      self.tiles = []
    },
  }))

export type IRegion = Instance<typeof Region> 

export default Region
