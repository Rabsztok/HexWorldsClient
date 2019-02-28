import Tile from './tile'

// Represents one field on the map. It's not a regular MST model for performance reasons.
// As these objects are numbered in hundreds of thousands,
// this class should be as thin as possible.
class TileObject {
  id: string
  type: string
  properties: any
  tile: Tile

  constructor(props: any) {
    this.id = props.id
    this.type = props.type
    this.properties = props.properties
    this.tile = props.tile
  }
}

export default TileObject
