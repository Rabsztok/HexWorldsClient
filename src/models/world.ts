import { countBy } from 'lodash'
import { types, Instance } from 'mobx-state-tree'

import Tile from 'models/tile'
import Region, { IRegion } from 'models/region'

import Canvas from './canvas'

// Whole world, divided into sectors. Each world is isolated from others.
const World = types
  .model('World', {
    id: types.identifier,
    size: types.number,
    name: types.string,
    regions: types.map(Region),
    canvas: Canvas
  })
  .volatile(() => ({
    tilesByCoordinates: new Map<string, Tile>(),
    tilesById: new Map<string, Tile>()
  }))
  .views((self) => ({
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
    get loading(): boolean {
      return this.regionsList.some((region) => !region.rendered)
    },
    findTileById(id: string): Tile | undefined {
      return self.tilesById.get(id)
    },
    findTileByCoordinates(x: number, y: number, z: number): Tile | undefined {
      return self.tilesByCoordinates.get([x, y, z].join(','))
    }
  }))
  .actions((self) => ({
    addTile(tile: Tile) {
      const { x, y, z, id } = tile
      self.tilesByCoordinates.set([x, y, z].join(','), tile)
      self.tilesById.set(id, tile)
    },
    addRegion(region: IRegion) {
      self.regions.set(region.id, region)
    },
    update({ regions, ...attributes }: { regions: any }) {
      Object.assign(self, attributes)
      if (regions) regions.forEach(this.addRegion)
    },
    reset() {
      self.regions.forEach((region) => region.reset()) 
    }
  }))

export type IWorld = Instance<typeof World>

export default World
