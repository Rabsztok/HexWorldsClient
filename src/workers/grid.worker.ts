import GridGeometry from 'three/geometries/grid_geometry'

const ctx: Worker = self as any

ctx.addEventListener(
  'message',
  e => {
    const terrain = e.data.terrain
    const geometry = new GridGeometry(e.data.tiles)

    ctx.postMessage({ terrain, ...geometry.attributes })
  },
  false
)
