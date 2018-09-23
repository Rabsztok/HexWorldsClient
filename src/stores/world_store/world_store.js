import { action, observable, computed } from 'mobx'
import WorldChannel from 'channels/world_channel'
import TileStore from 'stores/tile_store/tile_store'
import GridStore from 'stores/grid_store'
import CanvasStore from 'stores/canvas_store'
import World from 'records/world'

// Manages worlds list,
// also holds reference to tile, grid and canvas stores
// I'm considering moving tile/grid/canvas store associations to individual world models,
// but I hesitate about memory usage in such case. I will stress test that later on.
class WorldStore {
  @observable worlds = observable.map()
  @observable ready = false
  tileStore = null
  gridStore = null
  canvasStore = null

  connect() {
    if (this.channel) return

    this.channel = new WorldChannel({ onSuccess: this.onJoin })
    this.channel.socket.on('add', this.onAdd)
    this.channel.socket.on('remove', this.onRemove)
    this.channel.socket.on('update', this.onUpdate)
  }

  @computed
  get worldsList() {
    return Array.from(this.worlds.values())
  }

  @action
  selectWorld(id) {
    const world = this.worlds.get(id)

    this.tileStore = new TileStore(world)
    this.gridStore = new GridStore()
    this.canvasStore = new CanvasStore()

    this.tileStore.connect()
  }

  @action
  discardWorld() {
    this.tileStore = null
    this.gridStore = null
    this.canvasStore = null
  }

  @action
  onJoin = (response) => {
    response.worlds.forEach((world) => {
      this.worlds.set(world.id, new World(world))
    })
    this.ready = true
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
    return this.channel.socket.push('delete', { id: id })
  }
}

export default WorldStore