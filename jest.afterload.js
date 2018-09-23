/* eslint-disable */
import "raf/polyfill"
import { configure } from "enzyme"
import Adapter from "enzyme-adapter-react-16"
import * as THREE from "three"

configure({ adapter: new Adapter() })

beforeAll(() => {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000
})

beforeEach(() => {
  window.noop = () => {}
})

window.Worker = class {
  onmessage() {}
  postMessage() {}
}

THREE.WebGLRenderer = class {
  setPixelRatio() {}
  setClearColor() {}
  setSize() {}
}
