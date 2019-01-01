import WorldStore, { IWorldStore } from 'stores/world_store'
import { spy } from 'sinon'

describe('WorldStore', () => {
  let store: IWorldStore, world: any
  beforeEach(() => {
    store = WorldStore.create()
    store.channel.connection = { push: spy() }
    world = { id: '1', size: 1, name: 'World', regions: [] }
  })

  it('Presents worlds in list as an Array', () => {
    store.addWorld(world)
    expect(store.worldsList.constructor).toBe(Array)
    expect(store.worldsList.length).toBe(1)
  })

  it('Adds new worlds to worlds Map on channel join', () => {
    expect(store.worlds.size).toBe(0)
    store.onJoin({ worlds: [world] })
    expect(store.worlds.size).toBe(1)
  })

  it("Adds new world when 'add' message is received", () => {
    store.onAdd({ world: world })
    expect(store.worlds.get('1')).not.toBe(undefined)
  })

  it("Removes a world when 'remove' message is received", () => {
    store.addWorld(world)
    store.onRemove({ world: world })
    expect(store.worlds.get('1')).toBe(undefined)
  })

  it("Updated a world when 'update' message is received", () => {
    store.addWorld(world)
    store.onUpdate({ world: { ...world, name: 'new-name' } })
    expect(store.worlds.get('1')!.name).toBe('new-name')
  })

  it("sends 'create' message to websocket", () => {
    store.create('New World')
    expect(
      store.channel.connection.push.calledWith('create', {
        world: { name: 'New World' }
      })
    ).toBe(true)
  })

  it("sends 'expand' message to websocket", () => {
    store.expand('1')
    expect(
      store.channel.connection.push.calledWith('expand', { id: '1' })
    ).toBe(true)
  })

  it("sends 'delete' message to websocket", () => {
    store.remove('1')
    expect(
      store.channel.connection.push.calledWith('delete', { id: '1' })
    ).toBe(true)
  })
})
