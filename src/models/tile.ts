import { types, Instance } from 'mobx-state-tree'

const Tile = types
  .model('Tile', {
    id: types.identifier,
    x: types.frozen(types.number),
    y: types.frozen(types.number),
    z: types.frozen(types.number),
    height: types.frozen(types.number),
    terrain: types.frozen()
  })
  .views(self => ({
    get renderHeight(): number {
      return self.terrain.type === 'water' ? 1 : self.height
    }
  }))

export interface ITile extends Instance<typeof Tile> {}

export default Tile
