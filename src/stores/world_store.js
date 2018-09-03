import { action, observable } from 'mobx'
import autobind from 'autobind-decorator'
import WorldChannel from 'channels/world_channel'
import TileStore from './tile_store'
import GridStore from './grid_store'
import CanvasStore from './canvas_store'
import World from 'records/world'

class WorldStore {
  @observable worlds = observable.map()
  @observable ready = false
  @observable currentWorld
  tileStore = null
  gridStore = null
  canvasStore = null

  connect() {
    if (this.channel) return

    this.channel = new WorldChannel({ onSuccess: this.setWorlds })
    this.channel.socket.on('add', this.onAdd)
    this.channel.socket.on('remove', this.onRemove)
    this.channel.socket.on('update', this.onUpdate)
  }

  @autobind
  @action
  setWorlds(response) {
    response.worlds.forEach((world) => {
      this.worlds.set(world.id, new World(world))
    })
    this.ready = true
  }

  @action
  selectWorld(world) {
    this.currentWorld = world
    this.tileStore = new TileStore(world)
    this.gridStore = new GridStore()
    this.canvasStore = new CanvasStore()
  }

  @action
  discardWorld() {
    this.currentWorld = null
    this.tileStore = null
  }

  @autobind
  @action
  async onAdd(response) {
    const world = response.world
    this.worlds.set(world.id, new World(world))
  }

  @autobind
  @action
  onRemove(response) {
    this.worlds.delete(response.world.id)
  }

  @autobind
  @action
  onUpdate({world: {id, ...attributes}}) {
    const world = this.worlds.get(id)
    if (world) world.update(attributes)
  }

  @autobind
  create(name) {
    return this.channel.socket.push('create', { world: {name} })
  }

  @autobind
  expand(id) {
    return this.channel.socket.push('expand', { id: id })
  }

  @autobind
  delete(id) {
    this.channel.socket.push('delete', { id: id })
  }
}

export default WorldStore