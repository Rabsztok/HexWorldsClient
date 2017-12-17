import { action, observable } from 'mobx'
import _find from 'lodash/find'
import WorldChannel from 'channels/world_channel'
import autobind from 'autobind-decorator'

class WorldStore {
  @observable ready = false
  @observable worlds = []
  @observable currentWorld

  @autobind
  @action setWorlds(response) {
    this.worlds = response.worlds
    this.ready = true
  }

  connect() {
    if (this.channel) return

    this.channel = new WorldChannel('worlds:lobby')
    this.channel.connect(this.setWorlds)
  }


  @action selectWorld(world) {
    this.currentWorld = world
  }

  find(id) {
    return _find(this.worlds, { id: id })
  }
}

export default WorldStore