import {Group} from 'three'
import {observable} from 'mobx'

class Grid extends Group {
  @observable children = []
}

export default Grid