import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { computed } from 'mobx'
import { observer } from 'mobx-react'

import worldStore from 'stores/world_store'
import * as Pages from "pages/index"
import routes from 'utils/routes'

const NotFound = () => (
    <div>
      <h2>Uh oh!</h2>
      <p>We could not find what you were looking for!</p>
    </div>
)

@observer
class App extends React.Component {
  componentWillMount() {
    worldStore.connect()
  }

  @computed get ready() {
    return worldStore.ready
  }

  render() {
    if (this.ready)
      return (
          <Router>
            <div>
              <Switch>
                <Route exact path={routes.worlds()} component={Pages.Worlds}/>
                <Route path={routes.world(":id")} component={Pages.World}/>
                <Route component={NotFound}/>
              </Switch>
            </div>
          </Router>
      )
    else return null
  }
}

export default App