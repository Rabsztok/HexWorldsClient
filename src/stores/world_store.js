import { action, observable } from 'mobx'
import {find} from 'lodash'
import autobind from 'autobind-decorator'
import {apiClient} from 'utils/api'

class WorldStore {
  @observable worlds = []
  @observable currentWorld

  @autobind
  async fetchAll() {
    const {worlds} = await apiClient.get('worlds')
    this.worlds = worlds
  }

  @autobind
  async fetch(id) {
    return this.find(id) || (await apiClient.get(`worlds/${id}`)).world
  }

  @action
  selectWorld(world) {
    this.currentWorld = world
  }

  find(id) {
    return find(this.worlds, { id: id })
  }
}

export default WorldStore