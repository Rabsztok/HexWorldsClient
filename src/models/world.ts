import { countBy } from 'lodash'
import { types, Instance } from 'mobx-state-tree'
import Tile, { ITile } from 'models/tile'
import Region, { IRegion } from 'models/region'
import Canvas from './canvas'

const World = types
  .model('World', {
    id: types.identifier,
    size: types.number,
    name: types.string,
    regions: types.map(Region),
    canvas: Canvas,
    tileMatrix: types.map(types.reference(Tile))
  })
  .views(self => ({
    get regionsList(): IRegion[] {
      return Array.from(self.regions.values())
    },
    get state(): string {
      const regionsState = countBy(this.regionsList, 'state')
      if (regionsState.in_progress > 0) return 'generating regions'
      if (regionsState.empty > 0) return 'populating map'
      return 'ready'
    },
    get ready(): boolean {
      return this.state === 'ready'
    },
    findTile(x: number, y: number, z: number): ITile | undefined {
      return self.tileMatrix.get([x, y, z].join(','))
    }
  }))
  .actions(self => ({
    addTile(tile: ITile) {
      const { x, y, z } = tile
      self.tileMatrix.set([x, y, z].join(','), tile.id)
    },
    addRegion(region: IRegion) {
      self.regions.set(region.id, region)
    },
    update({ regions, ...attributes }: { regions: any }) {
      Object.assign(self, attributes)
      if (regions) regions.forEach(this.addRegion)
    },
    reset() {
      self.regions.forEach(region => region.reset())
    }
  }))

export interface IWorld extends Instance<typeof World> {}

export default World
