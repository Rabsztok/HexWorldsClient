import { Vector2, Raycaster } from 'three'
import { worldToCube } from './coordinates'

export default class PlayerControls {
  constructor(store, container) {
    this.store = store
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
      PlayerControls.dragDistance(this.mouseStartEvent, e) > 3
    )
      this.drag(e)
    else this.tap(e)
  }

  drag() {
    // console.log('drag')
  }

  tap(e) {
    const { move, create, currentPlayer } = this.store.worldStore.playerStore
    const tile = this.clickedTile(e)

    console.log(tile)
    if (tile) {
      if (!currentPlayer && e.button === 0) create(tile)
      if (currentPlayer && e.button === 2) move(tile)
    }
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

    const mouse = new Vector2()
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

    const raycaster = new Raycaster()
    raycaster.setFromCamera(mouse, this.store.worldStore.canvasStore.camera)
    const intersect = raycaster.intersectObjects(grid.children.slice())[0]

    if (intersect) {
      return nearest(worldToCube(intersect.point))
    } else return null
  }
}
