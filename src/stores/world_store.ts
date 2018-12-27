import { action, observable, computed } from 'mobx'
import Channel from 'channel'
import TileStore from 'stores/tile_store'
import GridStore from 'stores/grid_store'
import CanvasStore from 'stores/canvas_store'
import PlayerStore from 'stores/player_store'
import World from 'models/world'
import { PushEvent } from 'types'

// Manages worlds list,
// also holds reference to tile, grid and canvas stores
// I'm considering moving tile/grid/canvas store associations to individual world models,
// but I hesitate about memory usage in such case. I will stress test that later on.
class WorldStore {
  @observable worlds: Map<string, World> = observable.map()
  @observable ready: boolean = false
  @observable currentWorld?: World
  channel: Channel = new Channel('worlds:lobby')

  tileStore?: TileStore
  gridStore?: GridStore
  playerStore?: PlayerStore
  canvasStore?: CanvasStore

  connect(): void {
    if (this.channel.connected) return

    this.channel.connect(
      {},
      { onSuccess: this.onJoin }
    )
    this.channel.socket.on('add', this.onAdd)
    this.channel.socket.on('remove', this.onRemove)
    this.channel.socket.on('update', this.onUpdate)
  }

  @computed
  get worldsList(): World[] {
    return Array.from(this.worlds.values())
  }

  @action
  selectWorld(id: string): void {
    this.currentWorld = this.find(id)

    this.tileStore = new TileStore(this.currentWorld)
    this.playerStore = new PlayerStore(this.currentWorld)
    this.gridStore = new GridStore()
    this.canvasStore = new CanvasStore()

    this.tileStore.connect()
    this.playerStore.connect()
  }

  @action
  discardWorld(): void {
    this.currentWorld = undefined
    this.tileStore = undefined
    this.playerStore = undefined
    this.gridStore = undefined
    this.canvasStore = undefined
  }

  @action
  onJoin = ({ worlds }: { worlds: World[] }): void => {
    console.log('join')
    worlds.forEach(world => {
      this.worlds.set(world.id, new World(world))
    })
    this.ready = true
  }

  @action
  onAdd = ({ world }: { world: World }): void => {
    this.worlds.set(world.id, new World(world))
  }

  @action
  onRemove = ({ world: { id } }: { world: World }): void => {
    this.worlds.delete(id)
  }

  @action
  onUpdate = ({ world: { id, ...attributes } }: { world: World }) => {
    const world = this.find(id)
    if (world) world.update(attributes)
  }

  find = (id: string): World => {
    const world = this.worlds.get(id)
    if (world) return world
    else throw `World with id ${id} does not exist`
  }

  create = (name: string): PushEvent => {
    return this.channel.socket.push('create', { world: { name } })
  }

  expand = (id: string): PushEvent => {
    return this.channel.socket.push('expand', { id: id })
  }

  remove = (id: string): PushEvent => {
    return this.channel.socket.push('delete', { id: id })
  }
}

export default WorldStore
