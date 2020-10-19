import { Mesh } from 'three'
import { PLYExporter } from 'three/examples/jsm/exporters/PLYExporter'

import ForestGeometry from 'canvas/geometries/forest_geometry'

const ctx: Worker = self as any

ctx.addEventListener(
  'message',
  function (e) {
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