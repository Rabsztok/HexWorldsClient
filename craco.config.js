const ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin')
const path = require('path')

module.exports = {
  babel: {
    plugins: [['@babel/plugin-proposal-decorators', { legacy: true }]]
  },
  webpack: {
    plugins: [
      new ServiceWorkerWebpackPlugin({
        entry: path.resolve('src/workers/grid_worker.js'),
        filename: 'grid-worker.js'
      }),
      new ServiceWorkerWebpackPlugin({
        entry: path.resolve('src/workers/forest_worker.js'),
        filename: 'forest-worker.js'
      })
    ]
  }
}
