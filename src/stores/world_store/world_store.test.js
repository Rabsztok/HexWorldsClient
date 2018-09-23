import Store from "./world_store"
import World from "records/world"
import sinon from "sinon"

describe("BuildingsStore", () => {
  let store, world
  beforeEach(() => {
    store = new Store()
    store.channel = { socket: { push: sinon.stub() } }
    world = new World({ id: "1", name: "World" })
  })

  it("Presents worlds in list as an Array", () => {
    store.worlds.set("1", world)
    expect(store.worldsList.constructor).toBe(Array)
    expect(store.worldsList.length).toBe(1)
  })

  it("Selects and discards world as current one", () => {
    store.worlds.set("1", world)
    store.selectWorld(world.id)
    expect(store.tileStore.world.id).toBe("1")
    store.discardWorld()
    expect(store.tileStore).toBe(null)
  })

  it("Adds new worlds to worlds Map on channel join", () => {
    expect(store.worlds.size).toBe(0)
    store.onJoin({ worlds: [world] })
    expect(store.worlds.size).toBe(1)
  })

  it("Adds new world when 'add' message is received", () => {
    store.onAdd({ world: world })
    expect(store.worlds.get("1")).not.toBe(undefined)
  })

  it("Removes a world when 'remove' message is received", () => {
    store.worlds.set("1", world)
    store.onRemove({ world: world })
    expect(store.worlds.get("1")).toBe(undefined)
  })

  it("Updated a world when 'update' message is received", () => {
    store.worlds.set("1", world)
    store.onUpdate({ world: { ...world, name: "new-name" } })
    expect(store.worlds.get("1").name).toBe("new-name")
  })

  it("sends 'create' message to websocket", () => {
    store.create("New World")
    expect(
      store.channel.socket.push.calledWith("create", {
        world: { name: "New World" }
      })
    ).toBe(true)
  })

  it("sends 'expand' message to websocket", () => {
    store.expand("1")
    expect(store.channel.socket.push.calledWith("expand", { id: "1" })).toBe(
      true
    )
  })

  it("sends 'delete' message to websocket", () => {
    store.remove("1")
    expect(store.channel.socket.push.calledWith("delete", { id: "1" })).toBe(
      true
    )
  })
})
