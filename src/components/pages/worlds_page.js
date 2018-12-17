import React from 'react'
import { Link } from 'react-router-dom'
import { observer, inject } from 'mobx-react'
import {
  Card,
  CardContent,
  Grid,
  Typography,
  IconButton
} from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import EnlargeIcon from '@material-ui/icons/ZoomOutMap'
import styles from 'styles/pages/worlds_page.module.scss'
import BottomNavigation from 'components/bottom_navigation'
import WorldDialog from 'components/world_dialog'

const WorldsPage = ({
  store: {
    worldStore: { worldsList, expand, remove }
  }
}) => (
  <div className={styles.list}>
    <Grid container justify="center" spacing={16}>
      {worldsList.map(world => (
        <Grid key={world.id} item xs={12} sm={8}>
          <Card className={styles.item}>
            <CardContent>
              <Typography type="title">
                <Link
                  to={world.ready ? `/world/${world.id}` : '#'}
                  className={styles.link}
                >
                  {world.name}
                </Link>
              </Typography>

              <Typography type="body1">
                <span>state: {world.state}</span>
                {' / '}
                <span>regions: {world.regions.length}</span>
              </Typography>

              <div className={styles.actions}>
                <IconButton
                  onClick={() => expand(world.id)}
                  disabled={!world.ready}
                >
                  <EnlargeIcon />
                </IconButton>
                <IconButton onClick={() => remove(world.id)}>
                  <DeleteIcon />
                </IconButton>
              </div>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>

    <BottomNavigation>
      <WorldDialog />
    </BottomNavigation>
  </div>
)

export { WorldsPage }
export default inject('store')(observer(WorldsPage))
