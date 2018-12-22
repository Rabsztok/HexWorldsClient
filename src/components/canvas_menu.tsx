import React from 'react'
import { observer, inject } from 'mobx-react'
import { Fab } from '@material-ui/core'
import BackIcon from '@material-ui/icons/ArrowBack'
import ShowIcon from '@material-ui/icons/Language'
import { withRouter } from 'react-router-dom'
import styles from 'styles/canvas_menu.module.scss'
import routes from 'utils/routes'
import { StoreProps } from 'types'

interface Props {
  store?: StoreProps
  history?: { push: Function }
}

const CanvasMenu = ({ store, history }: Props) => {
  const { worldStore } = store!
  const { push } = history!

  return (
    <div className={styles.menu}>
      {worldStore.tileStore && (
        <Fab aria-label="show-all" onClick={worldStore.tileStore.showAll}>
          <ShowIcon />
        </Fab>
      )}

      <Fab
        color="primary"
        aria-label="back"
        onClick={() => push(routes.worlds())}
      >
        <BackIcon />
      </Fab>
    </div>
  )
}

export default inject('store')(withRouter(observer(CanvasMenu)))
