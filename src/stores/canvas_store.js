import * as THREE from 'three'

class CanvasStore {
  constructor() {
    window.onresize = this.resizeCanvas

    this.scene = new THREE.Scene()
    this.renderer = new THREE.WebGLRenderer()
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.cameraPosition = new THREE.Vector3(-100, 100, 0)
    this.lightPosition = new THREE.Vector3(100, 100, 100)
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000)
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setClearColor(0xaaeeff)
    this.camera.position.copy(this.cameraPosition)

    this.addLight()
    this.resizeCanvas()
  }

  addLight() {
    const ambientLight = new THREE.AmbientLight(0xddddcc, 0.7)
    const pointLight = new THREE.PointLight(0xffffff, 1)
    pointLight.position.copy(this.lightPosition)

    this.scene.add(ambientLight)
    this.scene.add(pointLight)
  }

  resizeCanvas = () => {
    this.width = window.innerWidth
    this.height = window.innerHeight

    this.renderer.setSize(this.width, this.height)
    this.camera.aspect = this.width / this.height
    this.camera.updateProjectionMatrix();

    this.animate()
  }

  animate = () => {
    window.requestAnimationFrame(this.reRender)
  }

  reRender = () => {
    this.renderer.render(this.scene, this.camera)
  }
}

export default CanvasStore