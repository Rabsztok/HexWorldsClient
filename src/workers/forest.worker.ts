import ForestGeometry from 'three/geometries/forest_geometry'
import { Mesh } from 'three'
const { PLYExporter } = require('three/examples/js/exporters/PLYExporter')
const ctx: Worker = self as any

ctx.addEventListener(
  'message',
  function(e) {
    const exporter = new PLYExporter()
    const terrain = e.data.terrain
    const geometry = new ForestGeometry(e.data.tiles)
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
