import {
  Scene,
  WebGLRenderer,
  Vector3,
  PerspectiveCamera,
  AmbientLight,
  PointLight
} from 'three'

class Canvas {
  scene = new Scene()
  renderer = new WebGLRenderer()
  width = window.innerWidth
  height = window.innerHeight
  cameraPosition = new Vector3(-100, 100, 0)
  lightPosition = new Vector3(100, 100, 100)
  camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
  )

  constructor() {
    window.onresize = this.resizeCanvas

    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setClearColor(0xaaeeff)
    this.camera.position.copy(this.cameraPosition)

    this.addLight()
    this.resizeCanvas()
  }

  addLight(): void {
    const ambientLight = new AmbientLight(0xddddcc, 0.7)
    const pointLight = new PointLight(0xffffff, 1)
    pointLight.position.copy(this.lightPosition)

    this.scene.add(ambientLight)
    this.scene.add(pointLight)
  }

  resizeCanvas = (): void => {
    this.width = window.innerWidth
    this.height = window.innerHeight

    this.renderer.setSize(this.width, this.height)
    this.camera.aspect = this.width / this.height
    this.camera.updateProjectionMatrix()

    this.animate()
  }

  animate = (): void => {
    window.requestAnimationFrame(this.reRender)
  }

  reRender = (): void => {
    this.renderer.render(this.scene, this.camera)
  }
}

export default Canvas
