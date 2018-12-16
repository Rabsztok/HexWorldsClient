import React from 'react'
import { observer, inject } from 'mobx-react'
import { Fab } from '@material-ui/core'
import BackIcon from '@material-ui/icons/ArrowBack'
import ShowIcon from '@material-ui/icons/Language'
import { Link } from 'react-router-dom'
import styles from './canvas_menu.module.scss'
import routes from 'utils/routes'

const CanvasMenu = ({
  store: {
    worldStore: { tileStore }
  }
}) => {
  const showAll = () => tileStore.showAll()

  return (
    <div className={styles.menu}>
      <Fab aria-label="show-all" onClick={showAll}>
        <ShowIcon />
      </Fab>

      <Fab
        color="primary"
        aria-label="back"
        component={Link}
        to={routes.worlds()}
      >
        <BackIcon />
      </Fab>
    </div>
  )
}

export default inject('store')(observer(CanvasMenu))
