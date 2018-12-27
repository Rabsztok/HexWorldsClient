interface HeightMap {
  xz: number
  yz: number
  yx: number
  zx: number
  zy: number
  xy: number
}

class Tile {
  id: string
  x: number
  y: number
  z: number
  height: number
  terrain: any
  rendered: boolean = false
  heightMap?: HeightMap

  constructor(props: any) {
    this.id = props.id
    this.x = props.x
    this.y = props.y
    this.z = props.z
    this.height = props.height
    this.terrain = props.terrain
    if (props.heightMap) this.heightMap = props.heightMap
  }

  get renderHeight(): number {
    return this.terrain.type === 'water' ? 1 : this.height
  }
}

export default Tile
