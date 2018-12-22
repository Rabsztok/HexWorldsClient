import GridGeometry from 'three/geometries/grid_geometry'
import { Mesh } from 'three'
const { PLYExporter } = require('three/examples/js/exporters/PLYExporter')
const ctx: Worker = self as any

ctx.addEventListener(
  'message',
  e => {
    const exporter = new PLYExporter()
    const terrain = e.data.terrain
    const geometry = new GridGeometry(e.data.tiles)
    const mesh = new Mesh(geometry)
    exporter.parse(
      mesh,
      (data: any) => {
        ctx.postMessage({ terrain, data })
      },
      { binary: true, excludeAttributes: ['color', 'uv', 'index'] }
    )
  },
  false
)
