import { IWorldStore } from 'stores/world_store'

export interface PushEvent {
  receive(message: string, callback: any): void
}

export interface StoreProps {
  store: {
    worldStore: IWorldStore
  }
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
