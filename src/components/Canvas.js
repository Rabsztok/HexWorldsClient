import React, {Component} from 'react'
import {observer} from 'mobx-react'
import * as THREE from 'three'
import canvasStore from 'stores/canvasStore'
import gridStore from 'stores/gridStore'
import autobind from 'autobind-decorator'

let OrbitControls = require('three-orbit-controls')(THREE)

@observer
export default class Canvas extends Component {
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000)
  renderer = new THREE.WebGLRenderer()

  componentWillMount() {
    canvasStore.setCanvasSize()
    window.onresize = canvasStore.setCanvasSize
  }

  componentDidMount() {
    this.camera.position.set(-30, 30, 0)

    this.addControls()
    this.addLight()
    this.addGrid()

    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.setClearColor(0xaaeeff)

    this.root.appendChild(this.renderer.domElement)

    this.animate()
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

  addGrid() {
    const grid = gridStore.setGrid()
    this.scene.add(grid)
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
    return (
        <div ref={(e) => this.root = e}/>
    )
  }
}
