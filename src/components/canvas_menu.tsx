import React from 'react'
import { observer, inject } from 'mobx-react'
import { Fab } from '@material-ui/core'
import BackIcon from '@material-ui/icons/ArrowBack'
import { withRouter } from 'react-router-dom'
import styles from 'styles/canvas_menu.module.scss'
import routes from 'utils/routes'
import { StoreProps } from 'types'

interface Props {
  store?: StoreProps
  history?: { push: Function }
}

const CanvasMenu = ({ store, history }: Props) => {
  const { push } = history!

  return (
    <div className={styles.menu}>
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
