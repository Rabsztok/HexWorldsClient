import {observable, action} from 'mobx'
import autobind from 'autobind-decorator'
import * as THREE from 'three'

class CanvasStore {
  @observable width = null
  @observable height = null
  @observable cameraPosition = new THREE.Vector3(-30, 30, 0)
  @observable cameraTarget = new THREE.Vector3(0, 0, 0)
  @observable lightPosition = new THREE.Vector3(0, 20, 20)
  @observable camera

  @autobind @action
  setCanvasSize() {
    this.width = window.innerWidth
    this.height = window.innerHeight
  }

  @action
  moveCamera(x, z) {
    this.cameraPosition = new THREE.Vector3(
        this.cameraPosition.x + x,
        this.cameraPosition.y,
        this.cameraPosition.z + z
    )
    this.cameraTarget = new THREE.Vector3(
        this.cameraTarget.x + x,
        this.cameraTarget.y,
        this.cameraTarget.z + z
    )
  }
}

export default CanvasStore