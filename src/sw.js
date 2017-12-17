import {each} from 'lodash'
import ForestGeometry from 'components/geometries/forest_geometry'
import GridGeometry from 'components/geometries/grid_geometry'
import * as THREE from 'three'

self.addEventListener('message', function(e) {
  const terrains = {dirt: 0x007B0C, stone: 0x666666, sand: 0xC2B280, water: 0x40A4DF, forest: 0x004B0C}
  const tiles = e.data.tiles
  const meshes = []

  each(terrains, (color, terrain) => {
    const mesh = new THREE.Mesh(
        new GridGeometry().fromTerrain(tiles, terrain),
        new THREE.MeshLambertMaterial({color: color, flatShading: true})
    )
    meshes.push(mesh)
  })

  // draw forest
  const mesh = new THREE.Mesh(
      new ForestGeometry().build(tiles),
      new THREE.MeshLambertMaterial( { color: 0x002B0C, flatShading: true } )
  )
  meshes.push(mesh)

  self.postMessage(meshes.toString());
}, false);