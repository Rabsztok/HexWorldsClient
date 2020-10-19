import { Object3D } from 'three'

class Player {
  id: string
  name: string
  world_id: string
  tile_id: string
  mesh?: Object3D
  rendered = false

  constructor(props: { id: string, name: string, world_id: string, tile_id: string }) {
    this.id = props.id
    this.name = props.name
    this.world_id = props.world_id
    this.tile_id = props.tile_id
  }
}

export default Player
