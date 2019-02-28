// Represents one field on the map. It's not a regular MST model for performance reasons.
// As these objects are numbered in hundreds of thousands,
// this class should be as thin as possible.
class Tile {
  id: string
  x: number
  y: number
  z: number
  height: number
  terrain: any
  object: any

  constructor(props: any) {
    this.id = props.id
    this.x = props.x
    this.y = props.y
    this.z = props.z
    this.height = props.height
    this.terrain = props.terrain
    this.object = props.object // todo: replace with actual object
  }

  get renderHeight(): number {
    return Math.max(this.height / 2, 1)
  }
}

export default Tile
