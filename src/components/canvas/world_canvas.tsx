import React from 'react'
import { autorun } from 'mobx'
import { observer } from 'mobx-react'
import BasicCanvas from './basic_canvas'
import { IWorld } from 'models/world'
import Controls from 'utils/player_controls'
import TileBuilder from 'three/builders/tile_builder'

interface Props {
  world: IWorld
}

class WorldCanvas extends React.Component<Props, {}> {
  canvas = React.createRef<BasicCanvas>()

  componentDidMount() {
    const { world } = this.props
    const { regions } = world

    // drawObjects when new tiles are loaded
    this.drawTiles()
    autorun(this.drawTiles)

    // ToDo: playerStore.players.observe(this.drawPlayers)

    // if (this.canvas.current)
    // new Controls(
    //   world,
    //   null,
    //   this.canvasStore,
    //   this.canvas.current.root.current
    // )

    // const centralRegion = this.props.world.regions.find(
    //   ({ x, y, z }) => x === 0 && y === 0 && z === 0
    // )
    // if (centralRegion) centralRegion.connect()
    regions.forEach(region => region.connect())
  }

  componentWillUnmount() {
    this.props.world.reset()
  }

  drawTiles = () => {
    const { regions, canvas } = this.props.world
    regions.forEach(region => {
      if (!region.rendered && region.readyToRender) {
        new TileBuilder(region).call(canvas)
      }
    })
  }

  // drawPlayers = () => {
  //   playerStore.playersToRender.forEach(player => {
  //     const tile = tileStore.get(player.tile_id)
  //     if (tile) new PlayerBuilder(tile, player).call(canvasStore)
  //   })
  // }

  render() {
    return <BasicCanvas ref={this.canvas} store={this.props.world.canvas} />
  }
}

export default observer(WorldCanvas)
