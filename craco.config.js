const ThreeWebpackPlugin = require('@wildpeaks/three-webpack-plugin')

module.exports = {
  babel: {
    plugins: [['@babel/plugin-proposal-decorators', { legacy: true }]]
  },
  webpack: {
    plugins: [new ThreeWebpackPlugin()],
    configure: (webpackConfig, { env, paths }) => {
      webpackConfig.output.globalObject = 'this'
      webpackConfig.module.rules.push({
        test: /\.worker\.js$/,
        use: { loader: 'worker-loader' }
      })
      return webpackConfig
    }
  },
  jest: {
    configure: {
      moduleNameMapper: {
        '.*.worker': '<rootDir>/__mocks__/worker_mock.js'
      }
    }
  }
}
