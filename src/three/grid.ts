import { Group, Object3D } from 'three'
import { observable } from 'mobx'

class Grid extends Group {
  readonly children = observable<Object3D>([])
}

export default Grid
