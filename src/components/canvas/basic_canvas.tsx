import React from 'react'
import { observer } from 'mobx-react'
const OrbitControls = require('three-orbitcontrols')
import { ICanvas } from 'models/canvas'

interface Props {
  store: ICanvas
}

@observer
class BasicCanvas extends React.Component<Props, {}> {
  public root = React.createRef<HTMLDivElement>()
  private controls?: any

  componentDidMount() {
    const { store } = this.props

    this.addControls()

    // append <canvas/> element to this component
    this.root.current &&
      this.root.current.appendChild(store.renderer.domElement)
  }

  // Controls
  // ToDo: move to separate ControlsStore
  addControls() {
    const { store } = this.props

    this.controls = new OrbitControls(store.camera, this.root.current)
    this.controls.maxPolarAngle = (2 * Math.PI) / 5
    this.controls.minPolarAngle = Math.PI / 8
    this.controls.target.set(0, 0, 0)
    this.controls.addEventListener('change', store.animate)
  }

  componentWillUnmount() {
    this.controls.dispose()
  }

  render() {
    return <div ref={this.root} />
  }
}

export { BasicCanvas }
export default BasicCanvas
