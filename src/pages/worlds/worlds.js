import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {observer} from 'mobx-react'
import Card, {CardContent} from 'material-ui/Card'
import Grid from 'material-ui/Grid'
import Typography from 'material-ui/Typography'
import worldStore from 'stores/world_store'
import styles from './worlds.scss'

@observer
class WorldList extends Component {
  render() {
    return (
        <div className={styles.list}>
          <Grid container justify="center">
            {worldStore.worlds.map((world) =>
                <Grid key={world.id} item xs={12} sm={8}>
                  <Card>
                    <CardContent>
                      <Typography type="title">
                        <Link to={`/world/${world.id}`} className={styles.link}>
                          {world.name}
                        </Link>
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
            )}
          </Grid>
        </div>
    )
  }
}

export default WorldList
