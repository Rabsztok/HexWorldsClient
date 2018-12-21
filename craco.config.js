module.exports = {
  babel: {
    plugins: [['@babel/plugin-proposal-decorators', { legacy: true }]]
  },
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      webpackConfig.output.globalObject = 'this'
      webpackConfig.module.rules.push({
        test: /\.worker\.js$/,
        use: { loader: 'worker-loader' }
      })
      return webpackConfig
    }
  }
}
