import React, { useEffect } from 'react'
import { autorun } from 'mobx'
import { observer } from 'mobx-react'

import { IWorld } from 'models/world'
import TileBuilder from 'canvas/builders/tile_builder'
import ObjectBuilder from 'canvas/builders/object_builder'

import BasicCanvas from './basic_canvas'

const WorldCanvas2 = ({ world }: { world: IWorld }) => {
  useEffect(
    () => {
      world.regions.forEach((region) => region.connect())

      autorun(() => {
        const { regions, canvas } = world
        regions.forEach((region) => {
          if (!region.rendered && region.readyToRender) {
            new TileBuilder(region).call(canvas)
            new ObjectBuilder(region).call(canvas)
          }
        })
      })
      return () => world.reset()
    },
    [world]
  )

  return <BasicCanvas canvas={world.canvas} />
}

export default observer(WorldCanvas2)
