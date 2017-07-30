import {clickedTile} from 'utils/canvas_helper'
import interfaceStore from 'stores/interfaceStore'
import autobind from 'autobind-decorator'

export default class Controls {
  constructor(canvas) {
    this.canvas = canvas

    this.canvas.on('mousedown', this.mouseDown)
    this.canvas.on('mouseup', this.mouseUp)
  }

  @autobind
  mouseDown(e) {
    this.mouseStartEvent = e

    interfaceStore.closeContextMenu()
  }

  @autobind
  mouseUp(e) {
    if (this.dragDistance(this.mouseStartEvent, e) > 3)
      this.drag(e)
    else
      this.tap(e)
  }

  drag(e) {
    console.log('drag')
  }

  tap(e) {
    const tile = clickedTile(e)

    if (tile)
      if (e.button === 0)
        interfaceStore.selectTile(tile)
      else if (e.button === 2)
        interfaceStore.openContextMenu(e, tile)
  }

  // helpers

  dragDistance(source, destination) {
    return Math.sqrt(
        Math.pow(source.clientX - destination.clientX, 2) + Math.pow(source.clientY - destination.clientY, 2)
    )
  }
}