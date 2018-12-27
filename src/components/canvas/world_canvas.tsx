import React from 'react'
import { autorun } from 'mobx'
import { observer, inject } from 'mobx-react'
import Canvas from './canvas'
import { StoreProps } from 'types'
import Controls from 'utils/player_controls'
import PlayerBuilder from 'three/builders/player_builder'

interface Props {
  store?: StoreProps
  match?: { params: { id: string } }
}

class WorldCanvas extends React.Component<Props, {}> {
  canvas = React.createRef<Canvas>()

  componentDidMount() {
    const { worldStore } = this.props.store!
    const gridStore = worldStore.gridStore!
    const canvasStore = worldStore.canvasStore!
    const playerStore = worldStore.playerStore!

    canvasStore.scene.add(gridStore.grid)

    // drawObjects when new tiles are loaded
    autorun(this.drawObjects)

    // rerender WorldCanvas when new grid elements are added
    gridStore.grid.children.observe(canvasStore.animate)

    playerStore.players.observe(this.drawPlayers)

    if (this.canvas.current)
      new Controls(this.props.store, this.canvas.current.root.current)
  }

  drawObjects = () => {
    const { worldStore } = this.props.store!
    const gridStore = worldStore.gridStore!
    const tileStore = worldStore.tileStore!

    const tiles = tileStore.tiles.filter(
      tile => !tile.rendered && tile.heightMap
    )

    if (!tiles.length) return

    gridStore.draw(tiles)

    tiles.map(tile => (tile.rendered = true))
  }

  drawPlayers = () => {
    const { worldStore } = this.props.store!
    const playerStore = worldStore.playerStore!
    const tileStore = worldStore.tileStore!
    const canvasStore = worldStore.canvasStore!

    playerStore.playersToRender.forEach(player => {
      const tile = tileStore.get(player.tile_id)
      if (tile) new PlayerBuilder(tile, player).call(canvasStore)
    })
  }

  render() {
    return (
      <Canvas
        ref={this.canvas}
        canvasStore={this.props.store!.worldStore.canvasStore!}
      />
    )
  }
}

export default inject('store')(observer(WorldCanvas))
