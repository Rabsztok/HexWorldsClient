import React from "react"
import ReactDOM from "react-dom"
import App from "app"
import registerServiceWorker from "register_service_worker"
import runtime from "serviceworker-webpack-plugin/lib/runtime"

ReactDOM.render(<App />, document.getElementById("root"))
registerServiceWorker()

if ("serviceWorker" in navigator) {
  runtime.register()
}
