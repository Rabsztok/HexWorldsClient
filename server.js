const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const config = require('./webpack.config')

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true
}).listen(3000, '10.0.1.75', function (err) {
  if (err) {
    console.log(err)
  }

  console.log('Listening at 10.0.1.75:3000')
})