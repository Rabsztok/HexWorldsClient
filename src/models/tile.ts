import { types, Instance, getParentOfType } from 'mobx-state-tree'
import World from './world'

interface HeightMap {
  xz: number
  yz: number
  yx: number
  zx: number
  zy: number
  xy: number
}

const Tile = types
  .model('Tile', {
    id: types.identifier,
    x: types.number,
    y: types.number,
    z: types.number,
    height: types.number,
    heightMap: types.maybe(types.frozen<HeightMap>()),
    terrain: types.frozen(),
    rendered: types.optional(types.boolean, false)
  })
  .views(self => ({
    getHeightDifference(x: number, y: number, z: number): number {
      return this.renderHeight
      // try {
      //   const neighbor = getParentOfType(self, World).findTile(
      //     self.x + x,
      //     self.y + y,
      //     self.z + z
      //   )

      //   return neighbor
      //     ? this.renderHeight - neighbor.renderHeight
      //     : this.renderHeight
      // } catch (error) {
      //   return this.renderHeight
      // }
    },
    get renderHeight(): number {
      return self.terrain.type === 'water' ? 1 : self.height
    }
  }))
  .actions(self => ({
    calculateHeightMap(): HeightMap {
      return (self.heightMap = {
        xz: self.getHeightDifference(-1, 0, 1),
        yz: self.getHeightDifference(0, -1, 1),
        yx: self.getHeightDifference(1, -1, 0),
        zx: self.getHeightDifference(0, 1, -1),
        zy: self.getHeightDifference(1, 0, -1),
        xy: self.getHeightDifference(-1, 1, 0)
      })
    }
  }))

export interface ITile extends Instance<typeof Tile> {}

export default Tile
