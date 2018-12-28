import { countBy } from 'lodash'
import { types, Instance } from 'mobx-state-tree'
import Tile, { ITile } from 'models/tile'
import Region, { IRegion } from 'models/region'

const World = types
  .model('World', {
    id: types.identifier,
    size: types.number,
    name: types.string,
    regions: types.map(Region),
    tileMatrix: types.map(types.reference(types.late(() => Tile)))
  })
  .views(self => ({
    get regionsList(): IRegion[] {
      return Array.from(self.regions.values())
    },
    get state(): string {
      const regionsState = countBy(this.regionsList, 'state')
      console.log(regionsState)
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
      console.log('update', regions, attributes)
      Object.assign(self, attributes)
      if (regions)
        regions.forEach((region: IRegion) =>
          self.regions.set(region.id, region)
        )
    }
  }))

export interface IWorld extends Instance<typeof World> {}

export default World
