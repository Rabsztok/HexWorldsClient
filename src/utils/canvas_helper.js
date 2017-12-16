import * as THREE from 'three'
import gridStore from 'stores/gridStore'
import tileStore from 'stores/tileStore'
import canvasStore from 'stores/canvasStore'
import {worldToCube} from 'utils/coordinates'

export function clickedTile(e) {
  let mouse = new THREE.Vector2()
  mouse.x = ( (e.clientX) / e.target.width ) * 2 - 1
  mouse.y = -( (e.clientY) / e.target.height ) * 2 + 1

  const raycaster = new THREE.Raycaster()
  raycaster.setFromCamera( mouse, canvasStore.camera )
  const intersect = raycaster.intersectObjects(gridStore.grid.children)[0]

  if (intersect) {
    let cube = worldToCube(intersect.point)
    return tileStore.nearest(cube)
  }
  else return null
}