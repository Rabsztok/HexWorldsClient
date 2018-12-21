import { Vector3 } from 'three'
import { CubeVector, Vector } from 'types'

export function worldToCube(vector: CubeVector): Vector {
  const x = vector.x / Math.sqrt(3) - vector.z / 3
  const z = (vector.z * 2) / 3
  const y = -x - z

  if (vector instanceof Vector3) return new Vector3(x, y, z)
  else return { x: x, y: y, z: z }
}

export function cubeToWorld(vector: Vector): CubeVector {
  const x = ((2 * vector.x + vector.z) * Math.sqrt(3)) / 2
  const z = (vector.z * 3) / 2

  return { x: x, z: z }
}

export function distance(source: Vector, destination: Vector): number {
  return Math.sqrt(
    Math.pow(source.x - destination.x, 2) +
      Math.pow(source.y - destination.y, 2) +
      Math.pow(source.z - destination.z, 2)
  )
}
