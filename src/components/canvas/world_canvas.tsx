import React from 'react'
import { autorun } from 'mobx'
import { observer } from 'mobx-react'
import Canvas from './canvas'
import CanvasStore from 'stores/canvas_store'
import GridStore from 'stores/grid_store'
import { IWorld } from 'models/world'
import Controls from 'utils/player_controls'
// import PlayerBuilder from 'three/builders/player_builder'

interface Props {
  world: IWorld
}

class WorldCanvas extends React.Component<Props, {}> {
  canvasStore = new CanvasStore()
  gridStore = new GridStore()
  canvas = React.createRef<Canvas>()

  componentDidMount() {
    this.canvasStore.scene.add(this.gridStore.grid)

    // drawObjects when new tiles are loaded
    autorun(this.drawObjects)

    // rerender WorldCanvas when new grid elements are added
    this.gridStore.grid.children.observe(this.canvasStore.animate)

    // ToDo: playerStore.players.observe(this.drawPlayers)

    if (this.canvas.current)
      new Controls(
        this.props.world,
        this.gridStore,
        this.canvasStore,
        this.canvas.current.root.current
      )

    const centralRegion = this.props.world.regionsList.find(
      ({ x, y, z }) => x === 0 && y === 0 && z === 0
    )
    if (centralRegion) centralRegion.connect()
    // this.props.world.regions.forEach(region => region.connect())
  }

  drawObjects = () => {
    this.props.world.regions.forEach(region => {
      this.gridStore.draw(region.tilesToRender)
      region.tilesToRender.forEach(tile => (tile.rendered = true))
    })
  }

  // drawPlayers = () => {
  //   playerStore.playersToRender.forEach(player => {
  //     const tile = tileStore.get(player.tile_id)
  //     if (tile) new PlayerBuilder(tile, player).call(canvasStore)
  //   })
  // }

  render() {
    return <Canvas ref={this.canvas} canvasStore={this.canvasStore} />
  }
}

export default observer(WorldCanvas)
