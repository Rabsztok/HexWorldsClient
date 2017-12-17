import React, {Component} from 'react'
import {autorunAsync} from 'mobx'
import {observer, inject} from 'mobx-react'
import * as THREE from 'three'
import autobind from 'autobind-decorator'
import {each} from 'lodash'
import ForestGeometry from './geometries/forest_geometry'
import GridGeometry from './geometries/grid_geometry'

let OrbitControls = require('three-orbit-controls')(THREE)

class Canvas extends Component {
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000)
  renderer = new THREE.WebGLRenderer()
  grid = new THREE.Group()
  terrains = {dirt: 0x007B0C, stone: 0x666666, sand: 0xC2B280, water: 0x40A4DF, forest: 0x004B0C}

  componentWillMount() {
    const canvasStore = this.props.store.canvasStore

    canvasStore.setCanvasSize()
    window.onresize = canvasStore.setCanvasSize
  }

  componentDidMount() {
    this.camera.position.set(-30, 30, 0)

    this.addControls()
    this.addLight()
    this.addGrid()
    autorunAsync(this.resizeCanvas)

    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setClearColor(0xaaeeff)
    this.resizeCanvas()

    this.root.appendChild(this.renderer.domElement)

    this.animate()
  }

  @autobind
  resizeCanvas() {
    const canvasStore = this.props.store.canvasStore
    this.renderer.setSize(canvasStore.width, canvasStore.height)
    this.camera.aspect = canvasStore.width / canvasStore.height
    this.camera.updateProjectionMatrix();
  }

  addControls() {
    this.controls = new OrbitControls(this.camera, this.root)
    this.controls.maxPolarAngle = 2 * Math.PI / 5
    this.controls.minPolarAngle = Math.PI / 8
    this.controls.target.set(0, 0, 0)
  }

  addLight() {
    const ambientLight = new THREE.AmbientLight(0x000000)
    const pointLight = new THREE.PointLight(0xffffff, 1)
    pointLight.position.set(50, 100, 50)

    this.scene.add(ambientLight)
    this.scene.add(pointLight)
  }

  @autobind
  addGrid() {
    this.scene.add(this.grid)
    autorunAsync(this.drawGrid)
  }

  @autobind
  drawGrid() {
    // this.grid.remove(...this.grid.children)

    var t0 = performance.now();
    each(this.terrains, (color, terrain) => {
      const mesh = new THREE.Mesh(
          new GridGeometry().fromTerrain(window.store.tileStore.tiles, terrain),
          new THREE.MeshLambertMaterial({color: color, flatShading: true})
      )
      this.grid.add(mesh)
    })
    var t1 = performance.now();
    console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.");

    // draw forest
    const mesh = new THREE.Mesh(
        new ForestGeometry().build(window.store.tileStore.tiles),
        new THREE.MeshLambertMaterial( { color: 0x002B0C, flatShading: true } )
    )
    this.grid.add(mesh)
  }

  componentWillUnmount() {
    this.controls.dispose()
  }

  @autobind
  animate() {
    window.requestAnimationFrame(this.animate)
    this.renderer.render(this.scene, this.camera)
  }

  render() {
    console.log('rerender')
    return (
        <div ref={(e) => this.root = e}/>
    )
  }
}

export default inject('store')(observer(Canvas))