import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {observer} from 'mobx-react'
import {Col, Panel} from 'react-bootstrap'

import worldStore from 'stores/worldStore'
import styles from 'styles/pages/world_index.scss'

@observer
class WorldList extends Component {
  render() {
    return (
        <Col md={6} mdOffset={3}>
          <div className={styles['world-list']}>
            <Panel header={<h3>Select world:</h3>}>
              { worldStore.worlds.map((world) =>
                  <Link key={world.id} to={`/world/${world.id}`} className='btn btn-default btn-block'>
                    {world.name}
                  </Link>
              )}
            </Panel>
          </div>
        </Col>
    )
  }
}

export default WorldList
