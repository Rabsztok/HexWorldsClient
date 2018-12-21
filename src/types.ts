import WorldStore from 'stores/world_store'

export interface PushEvent {
  receive(message: string, callback: Function): void
}

export interface StoreProps {
  worldStore: WorldStore
}

export interface CubeVector {
  x: number
  z: number
}

export interface Vector {
  x: number
  y: number
  z: number
}
