import { action, observable } from 'mobx'
import autobind from 'autobind-decorator'
import {apiClient} from 'utils/api'

class WorldStore {
  worlds = observable.map()
  @observable currentWorld

  @autobind
  @action
  async fetchAll() {
    const {worlds} = await apiClient.get('worlds')
    worlds.map((world) => this.worlds.set(world.id, world))
  }

  @autobind
  async fetch(id) {
    if (this.worlds.has(id)) {
      return this.worlds.get(id)
    }
    else {
      const {world} = await apiClient.get(`worlds/${id}`)
      this.worlds.set(world.id, world)
      return world
    }
  }

  @action
  selectWorld(world) {
    this.currentWorld = world
  }

  @autobind
  async create(name, size) {
    const {world} = await apiClient.post('worlds', { world: {name}, size: size })
    this.worlds.set(world.id, world)
  }

  @autobind
  async delete(id) {
    await apiClient.delete(`worlds/${id}`)
    this.worlds.delete(id)
  }
}

export default WorldStore