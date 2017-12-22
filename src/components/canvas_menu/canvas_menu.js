import React from 'react'
import {observer, inject} from 'mobx-react'
import Button from 'material-ui/Button'
import BackIcon from 'material-ui-icons/ArrowBack'
import ShowIcon from 'material-ui-icons/Language'
import styles from './canvas_menu.scss'
import routes from 'utils/routes'

const CanvasMenu = ({store: {tileStore, worldStore}}) => {
  const showAll = () => tileStore.showAll(worldStore.currentWorld.id)

  return (
      <div className={styles.menu}>
        <Button fab aria-label="show-all" onClick={showAll}>
          <ShowIcon/>
        </Button>

        <Button fab color="primary" aria-label="add" href={routes.worlds()}>
          <BackIcon/>
        </Button>
      </div>
  )
}


export default inject('store')(observer(CanvasMenu))