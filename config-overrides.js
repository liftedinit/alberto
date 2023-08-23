module.exports = {
  webpack: function override(webpackConfig) {
    webpackConfig.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: "javascript/auto",
    })

    return webpackConfig
  },
  devServer: function (configDevServer) {
    return function (proxy, allowedHosts) {
      const config = configDevServer(proxy, allowedHosts)
      return config
      // return { ...config, public: "wallet.end-labs.local" }
    }
  },
}
