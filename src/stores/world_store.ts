import { Instance, types } from 'mobx-state-tree'
import Channel from 'channel'
import World, { IWorld } from 'models/world'
import Canvas from 'models/canvas'
import { PushEvent } from 'types'

const WorldNotFoundError = (id: string) => `World with id ${id} does not exist`

const WorldStore = types
  .model('WorldsStore', {
    worlds: types.map(World),
    loaded: types.optional(types.boolean, false)
  })
  .volatile(self => ({
    channel: new Channel('worlds:lobby')
  }))
  .views(self => ({
    get worldsList(): IWorld[] {
      return Array.from(self.worlds.values())
    },
    find(id: string): IWorld {
      const world = self.worlds.get(id)
      if (world) return world
      else throw WorldNotFoundError(id)
    }
  }))
  .actions(self => {
    return {
      connect() {
        if (self.channel.connected) return

        self.channel.connect({}, { onSuccess: this.onJoin })
        self.channel.connection.on('add', this.onAdd)
        self.channel.connection.on('remove', this.onRemove)
        self.channel.connection.on('update', this.onUpdate)
      },
      onJoin({ worlds }: { worlds: IWorld[] }) {
        worlds.forEach(this.addWorld)
        self.loaded = true
      },
      onAdd({ world }: { world: any }) {
        this.addWorld(world)
      },
      onRemove({ world }: { world: any }) {
        this.removeWorld(world)
      },
      onUpdate({ world: { id, ...attributes } }: any) {
        self.find(id).update(attributes)
      },
      addWorld({ regions, ...attributes }: any) {
        const world = World.create({ ...attributes, canvas: Canvas.create() })
        regions.forEach(world.addRegion)

        self.worlds.set(world.id, world)
      },
      removeWorld({ id }: { id: string }) {
        self.worlds.delete(id)
      },
      create(name: string): PushEvent {
        return self.channel.connection.push('create', { world: { name } })
      },
      expand(id: string): PushEvent {
        return self.channel.connection.push('expand', { id: id })
      },
      remove(id: string): PushEvent {
        return self.channel.connection.push('delete', { id: id })
      }
    }
  })

export interface IWorldStore extends Instance<typeof WorldStore> {}

export default WorldStore

// @action
// selectWorld(id: string): void {
//   self.currentWorld = self.find(id)

//   self.tileStore = new TileStore(self.currentWorld)
//   self.playerStore = new PlayerStore(self.currentWorld)
//   self.gridStore = new GridStore()
//   self.canvasStore = new CanvasStore()

//   self.tileStore.connect()
//   self.playerStore.connect()
// }

// @action
// discardWorld(): void {
//   self.currentWorld = undefined
//   self.tileStore = undefined
//   self.playerStore = undefined
//   self.gridStore = undefined
//   self.canvasStore = undefined
// }
