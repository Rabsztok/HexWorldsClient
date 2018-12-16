import ForestGeometry from 'components/geometries/forest_geometry'

self.addEventListener(
  'message',
  function(e) {
    const geometry = new ForestGeometry(e.data.tiles)
    const terrain = e.data.terrain

    self.postMessage({ terrain, ...geometry.attributes })
  },
  false
)
