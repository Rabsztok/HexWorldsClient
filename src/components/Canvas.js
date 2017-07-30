import React, {Component} from 'react'
import {observer} from 'mobx-react'
import React3 from 'react-three-renderer'
import * as THREE from 'three'
import Grid from 'components/Grid'
import Interface from 'components/Interface'
import TileResources from 'components/resources/TileResources'
import canvasStore from 'stores/canvasStore'
import Controls from 'utils/controls'

let OrbitControls = require('three-orbit-controls')(THREE)

@observer
export default class Canvas extends Component {
  componentDidMount() {
    const controls = new OrbitControls(canvasStore.camera)

    controls.maxPolarAngle = 2 * Math.PI / 5
    controls.minPolarAngle = Math.PI / 8
    this.controls = controls

    this.controls = new Controls($('canvas'))
  }

  componentWillUnmount() {
    this.controls.dispose()
    delete this.controls
  }

  render() {
    let {width, height} = this.props

    return (
        <React3 mainCamera='camera' width={width} height={height} clearColor={0xaaeeff}
                antialias gammaInput gammaOutput>

          <TileResources/>

          <scene>
            <perspectiveCamera ref={(c) => canvasStore.camera = c} name='camera' fov={75}
                               aspect={width / height} near={0.1} far={2000}
                               position={canvasStore.cameraPosition} lookAt={canvasStore.cameraTarget}/>

            <Grid/>
            <Interface/>

            <ambientLight color={0xFFFFFF}/>
            <pointLight color={0xFFFFFF} intensity={1} position={canvasStore.lightPosition}/>
          </scene>

        </React3>
    )
  }
}
