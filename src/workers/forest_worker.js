import ForestGeometry from 'components/geometries/forest_geometry'
import {Mesh, MeshLambertMaterial} from 'three'

self.addEventListener('message', function(e) {
  const mesh = new Mesh(
      new ForestGeometry(e.data.tiles),
      new MeshLambertMaterial( { color: 0x002B0C, flatShading: true } )
  )

  self.postMessage(mesh.toJSON());
}, false);