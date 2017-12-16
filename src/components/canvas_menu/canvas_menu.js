import React from 'react'
import {observer} from 'mobx-react'
import Button from 'material-ui/Button'
import AddIcon from 'material-ui-icons/ArrowBack'
import styles from './canvas_menu.scss'
import routes from 'utils/routes'

const CanvasMenu = () =>
    <div className={styles.menu}>
      <Button fab color="primary" aria-label="add" href={routes.worlds()}>
        <AddIcon/>
      </Button>
    </div>

export default observer(CanvasMenu)