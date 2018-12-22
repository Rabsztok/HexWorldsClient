import React from 'react'
import { observer } from 'mobx-react'
import CanvasStore from 'stores/canvas_store'
const OrbitControls = require('three-orbitcontrols')

interface Props {
  canvasStore: CanvasStore
}

@observer
class Canvas extends React.Component<Props, {}> {
  public root = React.createRef<HTMLDivElement>()
  private controls?: any

  componentDidMount() {
    const { canvasStore } = this.props

    this.addControls()

    // append <canvas/> element to this component
    this.root.current &&
      this.root.current.appendChild(canvasStore.renderer.domElement)
  }

  // Controls
  // ToDo: move to separate ControlsStore

  addControls() {
    const { canvasStore } = this.props

    this.controls = new OrbitControls(canvasStore.camera, this.root.current)
    this.controls.maxPolarAngle = (2 * Math.PI) / 5
    this.controls.minPolarAngle = Math.PI / 8
    this.controls.target.set(0, 0, 0)
    this.controls.addEventListener('change', canvasStore.animate)
  }

  componentWillUnmount() {
    this.controls.dispose()
  }

  render() {
    return <div ref={this.root} />
  }
}

export { Canvas }
export default Canvas
