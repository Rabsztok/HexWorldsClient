import autobind from 'autobind-decorator'
import * as THREE from 'three'
import {worldToCube} from './coordinates'
import {pick} from 'lodash'

export default class Controls {
  constructor(store, camera, grid, container) {
    this.store = store
    this.camera = camera
    this.grid = grid
    this.container = container

    this.container.addEventListener('mousedown', this.mouseDown)
    this.container.addEventListener('mouseup', this.mouseUp)
  }

  @autobind
  mouseDown(e) {
    this.mouseStartEvent = e
  }

  @autobind
  mouseUp(e) {
    if (this.dragDistance(this.mouseStartEvent, e) > 3)
      this.drag(e)
    else
      this.tap(e)
  }

  drag() {
    // console.log('drag')
  }

  tap(e) {
    const tile = this.clickedTile(e)

    if (tile)
      if (e.button === 0)
        this.store.tileStore.move(this.store.worldStore.currentWorld.id, pick(tile, 'x', 'y', 'z'))
      else if (e.button === 2)
        console.log('mouse2')
  }

  // helpers

  dragDistance(source, destination) {
    return Math.sqrt(
        Math.pow(source.clientX - destination.clientX, 2) + Math.pow(source.clientY - destination.clientY, 2)
    )
  }

  clickedTile(event) {
    const { tileStore } = this.store

    const mouse = new THREE.Vector2()
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    const raycaster = new THREE.Raycaster()
    raycaster.setFromCamera( mouse, this.camera )
    const intersect = raycaster.intersectObjects(this.grid.children)[0]

    if (intersect) {
      return tileStore.nearest(worldToCube(intersect.point))
    }
    else return null
  }
}