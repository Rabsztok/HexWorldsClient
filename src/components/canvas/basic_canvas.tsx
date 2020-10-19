import React, { useEffect, useRef } from 'react'
import { observer } from 'mobx-react'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { ICanvas } from 'models/canvas'

interface PropTypes {
  canvas: ICanvas
}

const BasicCanvas : React.FunctionComponent<PropTypes> = ({ canvas }) => {
  const root = useRef<HTMLDivElement>(null)
  const controls = useRef<OrbitControls | null>(null)

  useEffect(() => {
    if (root.current) {
      root.current.appendChild(canvas.renderer.domElement)
      controls.current = new OrbitControls(canvas.camera, root.current)
      controls.current.maxPolarAngle = (2 * Math.PI) / 5
      controls.current.minPolarAngle = Math.PI / 8
      controls.current.target.set(0, 0, 0)
      controls.current.addEventListener('change', canvas.animate)
    }

    return () => {
      if (controls.current) controls.current.dispose()
    }
  }, [canvas])

  return <div ref={root} />
}

export { BasicCanvas }
export default observer(BasicCanvas)
