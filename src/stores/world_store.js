import { action, observable, computed } from 'mobx'
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

  @computed
  get worldsList() {
    return Array.from(this.worlds.values())
  }

  @action
  setWorlds = (response) => {
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

  @action
  onAdd = async (response) => {
    const world = response.world
    this.worlds.set(world.id, new World(world))
  }

  @action
  onRemove = async (response) => {
    this.worlds.delete(response.world.id)
  }

  @action
  onUpdate = async ({world: {id, ...attributes}}) => {
    const world = this.worlds.get(id)
    if (world) world.update(attributes)
  }

  create = (name) => {
    return this.channel.socket.push('create', { world: {name} })
  }

  expand = (id) => {
    return this.channel.socket.push('expand', { id: id })
  }

  remove = (id) => {
    this.channel.socket.push('delete', { id: id })
  }
}

export default WorldStore