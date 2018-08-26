import { computed, action, observable } from 'mobx'
import { countBy } from 'lodash'

class World {
  @observable regions = []

  constructor(world) {
    Object.assign(this, world)
  }

  @action
  update(attributes) {
    Object.assign(this, attributes)
  }

  @computed get regionState() {
    return countBy(this.regions, 'state')
  }

  @computed get state() {
    if (this.regionState.in_progress > 0) return 'generating regions'
    if (this.regionState.empty > 0) return 'populating map'
    return 'ready'
  }

  @computed get ready() {
    return this.state === 'ready'
  }
}

export default World