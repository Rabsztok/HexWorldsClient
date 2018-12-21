import GridGeometry from 'three/geometries/grid_geometry'

self.addEventListener(
  'message',
  function(e) {
    const terrain = e.data.terrain
    const geometry = new GridGeometry(e.data.tiles)

    self.postMessage({ terrain, ...geometry.attributes })
  },
  false
)
