import GridGeometry from 'components/geometries/grid_geometry'
import * as THREE from 'three'

self.addEventListener('message', function(e) {
  const mesh = new THREE.Mesh(
      new GridGeometry(e.data.tiles),
      new THREE.MeshLambertMaterial({color: e.data.color, flatShading: true})
  )

  self.postMessage(mesh.toJSON());
}, false);