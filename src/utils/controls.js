import * as THREE from 'three'
import { worldToCube } from './coordinates'
import { pick } from 'lodash'

export default class Controls {
  constructor(store, camera, container) {
    this.store = store
    this.camera = camera
    this.container = container

    this.container.addEventListener('mousedown', this.onMouseDown)
    this.container.addEventListener('mouseup', this.onMouseUp)
  }

  onMouseDown = e => {
    this.mouseStartEvent = e
  }

  onMouseUp = e => {
    if (
      this.mouseStartEvent &&
      Controls.dragDistance(this.mouseStartEvent, e) > 3
    )
      this.drag(e)
    else this.tap(e)
  }

  drag() {
    // console.log('drag')
  }

  tap(e) {
    const tile = this.clickedTile(e)

    if (tile)
      if (e.button === 0)
        this.store.worldStore.tileStore.move(pick(tile, 'x', 'y', 'z'))
      else if (e.button === 2) console.log('mouse2')
  }

  // helpers

  static dragDistance(source, destination) {
    return Math.sqrt(
      Math.pow(source.clientX - destination.clientX, 2) +
        Math.pow(source.clientY - destination.clientY, 2)
    )
  }

  clickedTile(event) {
    const {
      worldStore: {
        tileStore: { nearest },
        gridStore: { grid }
      }
    } = this.store

    const mouse = new THREE.Vector2()
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

    const raycaster = new THREE.Raycaster()
    raycaster.setFromCamera(mouse, this.camera)
    const intersect = raycaster.intersectObjects(grid.children.slice())[0]

    if (intersect) {
      return nearest(worldToCube(intersect.point))
    } else return null
  }
}
