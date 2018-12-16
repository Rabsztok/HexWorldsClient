import { computed, action, observable } from 'mobx'
import { countBy } from 'lodash'
import Region from 'records/region'

class World {
  id: number
  size: number
  name: string
  @observable regions: Region[]

  constructor(world: World) {
    this.id = world.id
    this.size = world.size
    this.name = world.name
    this.regions = world.regions
  }

  @action
  update(attributes: { size?: number; name?: string; regions?: Region[] }) {
    Object.assign(this, attributes)
  }

  @computed
  get regionState(): any {
    return countBy(this.regions, 'state')
  }

  @computed
  get state(): string {
    if (this.regionState.in_progress > 0) return 'generating regions'
    if (this.regionState.empty > 0) return 'populating map'
    return 'ready'
  }

  @computed
  get ready(): boolean {
    return this.state === 'ready'
  }
}

export default World
