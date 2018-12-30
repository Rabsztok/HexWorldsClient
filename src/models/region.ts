import { types, Instance } from 'mobx-state-tree'
import { ITile } from 'models/tile'
import Channel from 'channel'

const Region = types
  .model('Region', {
    id: types.identifier,
    x: types.frozen(types.number),
    y: types.frozen(types.number),
    z: types.frozen(types.number),
    tiles: types.frozen<ITile[]>(),
    state: types.string,
    rendered: types.optional(types.boolean, false),
    readyToRender: types.optional(types.boolean, false)
  })
  .views(self => ({
    // get world() {
    //   return getParentOfType(self, World)
    // },
    // get readyToRender() {
    //   return self.tiles && self.tiles.length === TILE_COUNT
    // }
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
      self.tiles = tiles
      self.readyToRender = true
      // tiles.forEach(tile => {
      //   self.world.addTile(tile)
      // })
    },
    onLoad({ tiles }: { tiles: ITile[] }) {
      this.addTiles(tiles)
    },
    markRendered() {
      self.rendered = true
    },
    reset() {
      self.rendered = false
    }
  }))

export interface IRegion extends Instance<typeof Region> {}

export default Region
