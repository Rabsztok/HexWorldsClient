import React from 'react'
import { observer } from 'mobx-react'
import { Fab } from '@material-ui/core'
import BackIcon from '@material-ui/icons/ArrowBack'
import { withRouter } from 'react-router-dom'
import {RouteComponentProps} from "react-router"

import styles from 'styles/canvas_menu.module.scss'
import routes from 'utils/routes'

const CanvasMenu = ({ history }: RouteComponentProps) => (
  <div className={styles.menu}>
    <Fab
      color="primary"
      aria-label="back"
      onClick={() => history.push(routes.worlds())}
    >
      <BackIcon />
    </Fab>
  </div>
)

export default withRouter(observer(CanvasMenu))
