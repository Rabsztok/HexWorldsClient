import GLTFLoader from 'three-gltf-loader'
import { Object3D } from 'three'

const WrongURLError = 'Wrong URL'

const loadMesh = (url: string): Promise<Object3D> => {
  const loader = new GLTFLoader()

  return new Promise((resolve, reject) => {
    loader.load(
      url,
      gltf => {
        const model = gltf.scene.children[0]
        if (model) {
          return resolve(model)
        } else {
          throw WrongURLError
        }
      },
      undefined,
      reject
    )
  })
}

export default loadMesh
