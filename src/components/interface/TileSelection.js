import React, {Component} from 'react'
import {observer} from 'mobx-react'
import * as THREE from 'three'
import interfaceStore from 'stores/interfaceStore'
import {cubeToWorld} from 'utils/coordinates'

@observer
class TileSelection extends Component {
  componentWillMount() {
    this.rotation = new THREE.Euler(-Math.PI / 2, 0, -Math.PI / 2)
    this.scale = new THREE.Vector3(0.1, 0.1, 0.1)
  }

  render() {
    const tile = interfaceStore.currentTile

    if (tile) {
      const coordinates = cubeToWorld(tile)
      const position = new THREE.Vector3(coordinates.x, tile.height/2 + 0.001, coordinates.z)

      return (
          <group>
            <mesh scale={this.scale} rotation={this.rotation} position={position}>
              <ringGeometry innerRadius={8} outerRadius={10} thetaSegments={6} phiSegments={1}/>
              <meshBasicMaterial color={0x0000dd}/>
            </mesh>
          </group>
      )
    }
    else return null
  }
}

export default TileSelection