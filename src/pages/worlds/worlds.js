import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {observer, inject} from 'mobx-react'
import Card, {CardContent} from 'material-ui/Card'
import Grid from 'material-ui/Grid'
import Typography from 'material-ui/Typography'
import styles from './worlds.scss'

class WorldList extends Component {
  componentWillMount() {
    this.props.store.worldStore.fetchAll()
  }

  render() {
    const worlds = this.props.store.worldStore.worlds
    if (!worlds.length) return null
    
    return (
        <div className={styles.list}>
          <Grid container justify="center">
            {worlds.map((world) =>
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

export default inject('store')(observer(WorldList))
