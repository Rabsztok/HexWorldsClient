import React, { useMemo } from 'react'
import { observer, inject } from 'mobx-react'
import { CircularProgress } from '@material-ui/core'
import {RouteComponentProps } from 'react-router'

import Canvas from 'components/canvas/world_canvas'
import Menu from 'components/canvas_menu'
import styles from 'styles/pages/world_page.module.scss'
import { StoreProps } from 'types'

type PathParamsType = {
  id: string | undefined,
}

// Your component own properties
type PropTypes = RouteComponentProps<PathParamsType> & StoreProps

const WorldPage : React.FunctionComponent<PropTypes> = ({ store: { worldStore }, match: { params: { id } } }) => {
  const world = useMemo(
    () => id ? worldStore.find(id) : null
  , [worldStore, id])

  if (!world) return null

  return (
    <React.Fragment>
      <Menu />

      {world.loading && (
        <div className={styles.loading}>
          <CircularProgress size={50} thickness={5} />
        </div>
      )}

      <div className={styles.container}>
        <Canvas world={world} />
      </div>
    </React.Fragment>
  )
}

export { WorldPage }
export default inject('store')(observer(WorldPage))
