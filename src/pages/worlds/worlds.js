import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {observer, inject} from 'mobx-react'
import Card, {CardContent} from 'material-ui/Card'
import Grid from 'material-ui/Grid'
import Typography from 'material-ui/Typography'
import IconButton from 'material-ui/IconButton'
import DeleteIcon from 'material-ui-icons/Delete'
import EnlargeIcon from 'material-ui-icons/ZoomOutMap'
import styles from './worlds.scss'
import BottomNavigation from 'components/bottom_navigation/bottom_navigation'
import WorldDialog from 'components/world_dialog/world_dialog'

class Worlds extends Component {
  render() {
    const worldStore = this.props.store.worldStore
    const worlds = worldStore.worlds.values()

    return (
        <div className={styles.list}>
          <Grid container justify="center">
            {worlds.map((world) =>
                <Grid key={world.id} item xs={12} sm={8}>
                  <Card className={styles.item}>
                    <CardContent>
                      <Typography type="title">
                        <Link to={world.ready ? `/world/${world.id}` : "#"} className={styles.link}>
                          {world.name}
                        </Link>
                      </Typography>

                      <Typography type="body1">
                        <span>state: {world.state}</span>
                        {" / "}
                        <span>regions: {world.regions.length}</span>
                      </Typography>

                      <div className={styles.actions}>
                        <IconButton onClick={() => worldStore.expand(world.id)} disabled={!world.ready}>
                          <EnlargeIcon/>
                        </IconButton>
                        <IconButton onClick={() => worldStore.delete(world.id)}>
                          <DeleteIcon/>
                        </IconButton>
                      </div>
                    </CardContent>
                  </Card>
                </Grid>
            )}
          </Grid>

          <BottomNavigation>
            <WorldDialog/>
          </BottomNavigation>
        </div>
    )
  }
}

export default inject('store')(observer(Worlds))
