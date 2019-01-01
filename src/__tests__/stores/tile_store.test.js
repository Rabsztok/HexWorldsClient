/* eslint-env jest */
import TileStore from 'stores/tile_store'
import Tile from 'models/tile'
import sinon from 'sinon'

describe('TileStore', () => {
  let store, tile, neighbor

  beforeEach(() => {
    store = new TileStore()
    store.world = { id: '1' }
    store.channel = { socket: { push: sinon.spy() } }
    tile = new Tile({
      id: '1',
      height: 1,
      x: 0,
      y: 0,
      z: 0,
      terrain: { type: 'dirt' }
    })
    neighbor = new Tile({
      id: '1',
      height: 3,
      x: 0,
      y: 1,
      z: -1,
      terrain: { type: 'dirt' }
    })
  })

  it('Adds new tiles to existing set', () => {
    store.addTiles([tile])
    expect(store.tiles.length).toBe(1)
  })

  it('Does not add tile if it already exists in set', () => {
    store.addTiles([tile])
    store.addTiles([tile])
    expect(store.tiles.length).not.toBe(2)
  })

  it('Finds tile usings its coordinates', () => {
    store.addTiles([tile])
    expect(store.find(0, 0, 0).id).toBe(tile.id)
  })

  it('Gets height difference between two neighbors', () => {
    store.addTiles([tile, neighbor])
    expect(store.getHeightDifference(tile, 0, 1, -1)).toBe(-2)
  })

  it('Gets height difference between tile and edge of visible map', () => {
    store.addTiles([tile])
    expect(store.getHeightDifference(tile, 0, 1, -1)).toBe(tile.height)
  })

  it('Finds nearest tile to given coordinates', () => {
    store.addTiles([tile, neighbor])
    expect(store.nearest({ x: 0, y: -0.1, z: 0.1 }).id).toBe(tile.id)
  })

  it("sends 'move' message to websocket", () => {
    store.move({ x: 0, y: 0, z: 0 })
    expect(
      store.channel.connection.push.calledWith('move', {
        world_id: '1',
        coordinates: { x: 0, y: 0, z: 0 },
        range: 50
      })
    ).toBe(true)
  })

  it("sends 'showAll' message to websocket", () => {
    store.showAll()
    expect(
      store.channel.connection.push.calledWith('move', {
        world_id: '1',
        coordinates: { x: 0, y: 0, z: 0 },
        range: 10000
      })
    ).toBe(true)
  })
})
