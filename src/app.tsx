import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { observer, Provider } from 'mobx-react'

import WorldStore from 'stores/world_store'
import * as Pages from 'components/pages'
import routes from 'utils/routes'

@observer
class App extends React.Component {
  store = {
    worldStore: WorldStore.create()
  }

  UNSAFE_componentWillMount() {
    this.store.worldStore.connect()

    // @ts-ignore
    window.store = this.store
  }

  render() {
    // ToDo: move to protected route
    if (!this.store.worldStore.loaded) return null

    return (
      <Provider store={this.store}>
        <Router>
          <div>
            <Switch>
              <Route
                exact
                path={routes.worlds()}
                component={Pages.WorldsPage}
              />
              <Route path={routes.world(':id')} component={Pages.WorldPage} />
              <Route path={routes.debug()} component={Pages.DebugPage} />
              <Route component={Pages.NotFoundPage} />
            </Switch>
          </div>
        </Router>
      </Provider>
    )
  }
}

export default App
