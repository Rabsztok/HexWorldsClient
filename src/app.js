import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { observer, Provider } from 'mobx-react'

import * as Stores from 'stores'
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
    this.store = {
      worldStore: new Stores.WorldStore(),
      gridStore: new Stores.GridStore(),
      canvasStore: new Stores.CanvasStore(),
      tileStore: new Stores.TileStore()
    }

    window.store = this.store
  }

  render() {
    return (
        <Provider store={this.store}>
          <Router>
            <div>
              <Switch>
                <Route exact path={routes.worlds()} component={Pages.Worlds}/>
                <Route path={routes.world(":id")} component={Pages.World}/>
                <Route component={NotFound}/>
              </Switch>
            </div>
          </Router>
        </Provider>
    )
  }
}

export default App