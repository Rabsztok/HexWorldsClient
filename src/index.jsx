import React from 'react'
import ReactDOM from 'react-dom'
import App from 'app'
import runtime from 'serviceworker-webpack-plugin/lib/runtime'

ReactDOM.render(<App />, document.getElementById('root'))

if ('serviceWorker' in navigator) {
  runtime.register()
}
