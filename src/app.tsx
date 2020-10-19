import React, { useRef, useEffect } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { observer, Provider } from 'mobx-react'

import WorldStore from 'stores/world_store'
import * as Pages from 'components/pages'
import routes from 'utils/routes'

const App : React.FunctionComponent = () => {
  const store = useRef({
    worldStore: WorldStore.create()
  })

  useEffect(() => {
    store.current.worldStore.connect() 
  }, [])

  if (!store.current.worldStore.loaded) return null

  return (
    <Provider store={store.current}>
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

export default observer(App)
