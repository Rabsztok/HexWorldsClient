import React from 'react'
import { observer, inject } from 'mobx-react'
import Canvas from 'components/canvas/canvas'
import Menu from 'components/canvas_menu'
import styles from 'styles/pages/world_page.module.scss'
import { StoreProps } from 'types'
import CanvasStore from 'stores/canvas_store'
import TileGeometry from 'three/geometries/tile_geometry'
import Tile from 'models/tile'
import { Mesh, MeshLambertMaterial, Vector3, Scene } from 'three'
const { GLTFLoader } = require('three/examples/js/loaders/GLTFLoader')

interface Props {
  store: StoreProps
  match: { params: { id: string } }
}

class DebugPage extends React.Component<Props, {}> {
  canvasStore = new CanvasStore()
  tile = new Tile({
    x: 0,
    y: 0,
    z: 0,
    height: 1,
    terrain: { type: 'dirt' },
    heightMap: {
      xz: 1,
      yz: 1,
      yx: 1,
      zx: 1,
      zy: 1,
      xy: 1
    }
  })

  componentDidMount() {
    this.renderTile()
    this.renderObject()
    this.canvasStore.camera.position.copy(new Vector3(-5, 5, 0))
  }

  renderTile = () => {
    const mesh = new Mesh(
      new TileGeometry(this.tile),
      new MeshLambertMaterial({
        color: 0x007b0c,
        flatShading: true
      })
    )
    this.canvasStore.scene.add(mesh)
  }

  renderObject() {
    const loader = new GLTFLoader()
    loader.load('/mesh/house.gltf', ({ scene }: { scene: Scene }) => {
      this.canvasStore.scene.add(scene.children[0])
      this.canvasStore.animate()
    })
  }

  render() {
    return (
      <React.Fragment>
        <Menu />

        <div className={styles.container}>
          <Canvas canvasStore={this.canvasStore} />
        </div>
      </React.Fragment>
    )
  }
}

export { DebugPage }
export default inject('store')(observer(DebugPage))
