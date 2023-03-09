const webpack = require("webpack")

module.exports = {
  webpack: function override(webpackConfig) {
    webpackConfig.resolve.fallback = {
      buffer: require.resolve("buffer"),
    }
    webpackConfig.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: "javascript/auto",
    })
    webpackConfig.plugins.push(
      new webpack.ProvidePlugin({
        Buffer: ["buffer", "Buffer"],
      }),
    )

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
