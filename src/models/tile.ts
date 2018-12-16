interface HeightMap {
  xz: number
  yz: number
  yx: number
  zx: number
  zy: number
  xy: number
}

class Tile {
  x: number
  y: number
  z: number
  height: number
  terrain: any
  rendered: boolean
  heightMap?: HeightMap

  constructor(tile: Tile) {
    this.x = tile.x
    this.y = tile.y
    this.z = tile.z
    this.height = tile.height
    this.terrain = tile.terrain
    this.heightMap = tile.heightMap || undefined
    this.rendered = tile.rendered || false
  }

  get renderHeight(): number {
    return this.terrain.type === 'water' ? 1 : this.height
  }
}

export default Tile
