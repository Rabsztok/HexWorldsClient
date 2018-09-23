import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { observer, Provider } from 'mobx-react'

import * as Stores from 'stores'
import * as Pages from "pages/index"
import routes from 'utils/routes'

@observer
class App extends React.Component {
  UNSAFE_componentWillMount() {
    this.store = {
      worldStore: new Stores.WorldStore()
    }

    window.store = this.store
    this.store.worldStore.connect()
  }

  render() {
    // ToDo: move to protected route
    if (!this.store.worldStore.ready) return null

    return (
        <Provider store={this.store}>
          <Router>
            <div>
              <Switch>
                <Route exact path={routes.worlds()} component={Pages.WorldsPage}/>
                <Route path={routes.world(":id")} component={Pages.WorldPage}/>
                <Route component={Pages.NotFoundPage}/>
              </Switch>
            </div>
          </Router>
        </Provider>
    )
  }
}

export default App