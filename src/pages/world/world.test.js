import React from "react"
import { shallow } from "enzyme"
import { WorldPage } from "./world"
import { spy } from "sinon"
import Canvas from "components/canvas"
import { CircularProgress } from "@material-ui/core"

const noop = () => {}

describe("World", () => {
  it("renders without errors", () => {
    const store = {
      worldStore: { selectWorld: spy(), gridStore: { loading: false } }
    }
    const component = shallow(
      <WorldPage store={store} match={{ params: { id: "1" } }} />
    )

    expect(store.worldStore.selectWorld.calledWith("1")).toBe(true)
    expect(component.find(Canvas).exists()).toBe(true)
  })

  it("renders loading indicator when grid is being loaded", () => {
    const store = {
      worldStore: { selectWorld: noop, gridStore: { loading: true } }
    }
    const component = shallow(
      <WorldPage store={store} match={{ params: { id: "1" } }} />
    )

    expect(component.find(CircularProgress).exists()).toBe(true)
  })

  it("discards current world on page exit", () => {
    const store = {
      worldStore: {
        selectWorld: noop,
        discardWorld: spy(),
        gridStore: { loading: true }
      }
    }
    const component = shallow(
      <WorldPage store={store} match={{ params: { id: "1" } }} />
    )

    component.unmount()

    expect(store.worldStore.discardWorld.calledOnce).toBe(true)
  })
})
