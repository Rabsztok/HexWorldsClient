import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {observer} from 'mobx-react'
import Card, {CardContent} from 'material-ui/Card'
import Grid from 'material-ui/Grid'
import Typography from 'material-ui/Typography'
import worldStore from 'stores/worldStore'
import styles from './worlds.scss'
import Navigation from 'components/Navigation'

@observer
class WorldList extends Component {
  render() {
    return (
        <div>
          <Navigation/>

          <div className={styles['worlds']}>
            <Grid container justify="center">
              {worldStore.worlds.map((world) =>
                  <Grid key={world.id} item xs={12} sm={8} md={6}>
                    <Card>
                      <CardContent>
                        <Typography type="title">
                          <Link to={`/world/${world.id}`}>
                            {world.name}
                          </Link>
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
              )}
            </Grid>
          </div>
        </div>
    )
  }
}

export default WorldList
