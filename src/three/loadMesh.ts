const { GLTFLoader } = require('three/examples/js/loaders/GLTFLoader')
import { GLTF, Object3D } from 'three'

const loadMesh = (url: string): Promise<Object3D> => {
  const loader = new GLTFLoader()

  return new Promise((resolve, reject) => {
    const onLoad = (gltf: GLTF) => {
      return resolve(gltf.scene.children[0])
    }

    loader.load(url, onLoad, undefined, reject)
  })
}

export default loadMesh
