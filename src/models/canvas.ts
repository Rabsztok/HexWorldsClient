import { types, Instance } from 'mobx-state-tree'
import {
  Scene,
  WebGLRenderer,
  Vector3,
  PerspectiveCamera,
  AmbientLight,
  PointLight
} from 'three'

const Canvas = types
  .model('Canvas', {})
  .volatile(() => ({
    cameraPosition: new Vector3(-100, 100, 0),
    lightPosition: new Vector3(100, 100, 100),
    scene: new Scene(),
    renderer: new WebGLRenderer(),
    width: window.innerWidth,
    height: window.innerHeight,
    camera: new PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    )
  }))
  .actions((self) => ({
    afterCreate() {
      window.onresize = this.resizeCanvas

      self.renderer.setPixelRatio(window.devicePixelRatio)
      self.renderer.setClearColor(0xaaeeff)
      self.camera.position.copy(self.cameraPosition)

      this.addLight()
      this.resizeCanvas()
    },

    addLight() {
      const ambientLight = new AmbientLight(0xddddcc, 0.7)
      const pointLight = new PointLight(0xffffff, 1)
      pointLight.position.copy(self.lightPosition)

      self.scene.add(ambientLight)
      self.scene.add(pointLight)
    },

    resizeCanvas() {
      self.width = window.innerWidth
      self.height = window.innerHeight

      self.renderer.setSize(self.width, self.height)
      self.camera.aspect = self.width / self.height
      self.camera.updateProjectionMatrix()

      this.animate()
    },

    animate() {
      window.requestAnimationFrame(this.reRender)
    },

    reRender() {
      self.renderer.render(self.scene, self.camera)
    }
  }))

export type ICanvas = Instance<typeof Canvas>

export default Canvas
