import { Vector2, Raycaster } from 'three'
import { worldToCube } from './coordinates'

export default class PlayerControls {
  constructor(world, gridStore, canvasStore, canvas) {
    this.world = world
    this.gridStore = gridStore
    this.canvasStore = canvasStore
    this.canvas = canvas

    this.canvas.addEventListener('mousedown', this.onMouseDown)
    this.canvas.addEventListener('mouseup', this.onMouseUp)
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
    // const { move, create, currentPlayer } = this.store.worldStore.playerStore
    const tile = this.clickedTile(e)

    console.log(tile)
    // if (tile) {
    //   if (!currentPlayer && e.button === 0) create(tile)
    //   if (currentPlayer && e.button === 2) move(tile)
    // }
  }

  // helpers

  static dragDistance(source, destination) {
    return Math.sqrt(
      Math.pow(source.clientX - destination.clientX, 2) +
        Math.pow(source.clientY - destination.clientY, 2)
    )
  }

  clickedTile(event) {
    const { grid } = this.gridStore
    const { camera } = this.canvasStore

    const mouse = new Vector2()
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

    const raycaster = new Raycaster()
    raycaster.setFromCamera(mouse, camera)
    const intersect = raycaster.intersectObjects(grid.children.slice())[0]

    if (intersect) {
      // ToDo: return this.world.findNearest(worldToCube(intersect.point))
    } else return null
  }
}
