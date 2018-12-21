import ForestGeometry from 'three/geometries/forest_geometry'

const ctx: Worker = self as any

ctx.addEventListener(
  'message',
  function(e) {
    const geometry = new ForestGeometry(e.data.tiles)
    const terrain = e.data.terrain

    ctx.postMessage({ terrain, ...geometry.attributes })
  },
  false
)
