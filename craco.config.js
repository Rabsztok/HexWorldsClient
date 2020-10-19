module.exports = {
  babel: {
    plugins: [
      ['@babel/plugin-proposal-decorators', { legacy: true }],
      ["@babel/plugin-proposal-class-properties", { "loose": false }]
    ]
  },
  webpack: {
    configure: (webpackConfig) => {
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
