import React, {Component} from 'react'
import {autorunAsync} from 'mobx'
import {observer, inject} from 'mobx-react'
import * as THREE from 'three'
import autobind from 'autobind-decorator'
import {filter} from 'lodash'
import Controls from 'utils/controls'

let OrbitControls = require('three-orbit-controls')(THREE)

class Canvas extends Component {
  componentDidMount() {
    const {gridStore, canvasStore} = this.props.store

    canvasStore.scene.add(gridStore.grid)

    // drawObjects when new tiles are loaded
    autorunAsync(this.drawObjects)

    // rerender canvas when new grid elements are added
    gridStore.grid.children.observe(canvasStore.animate)

    this.addControls()

    // append <canvas/> element to this component
    this.root.appendChild(canvasStore.renderer.domElement)
  }

  @autobind
  drawObjects() {
    const { tileStore, gridStore } = this.props.store

    let tiles = filter(tileStore.tiles, (tile) => !tile.rendered)

    if (!tiles.length) return

    gridStore.draw(tiles)

    tiles.map((tile) => tile.rendered = true)
  }

  // Controls
  // ToDo: move to separate ControlsStore

  addControls() {
    const canvasStore = this.props.store.canvasStore

    this.controls = new OrbitControls(canvasStore.camera, this.root)
    this.controls.maxPolarAngle = 2 * Math.PI / 5
    this.controls.minPolarAngle = Math.PI / 8
    this.controls.target.set(0, 0, 0)
    this.controls.addEventListener( 'change', canvasStore.animate )

    new Controls(this.props.store, canvasStore.camera, this.root)
  }

  componentWillUnmount() {
    this.controls.dispose()
  }

  render() {
    return (
        <div ref={(e) => this.root = e}/>
    )
  }
}

export default inject('store')(observer(Canvas))