const webpack = require("webpack")

module.exports = {
  webpack: function override(webpackConfig) {
    webpackConfig.resolve.fallback = {
      buffer: require.resolve("buffer"),
      crypto: require.resolve("crypto-browserify"),
      http: require.resolve("stream-http"),
      https: require.resolve("https-browserify"),
      process: require.resolve("process/browser"),
      stream: require.resolve("stream-browserify"),
      zlib: require.resolve("browserify-zlib"),
    }
    webpackConfig.plugins.push(
      new webpack.ProvidePlugin({
        process: "process/browser",
        Buffer: ["buffer", "Buffer"],
      }),
    )
    webpackConfig.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: "javascript/auto",
      resolve: {
        fullySpecified: false,
      },
    })

    return webpackConfig
  },
  devServer: function(configDevServer) {
    return function(proxy, allowedHosts) {
      const config = configDevServer(proxy, allowedHosts)
      return config
      // return { ...config, public: "wallet.end-labs.local" }
    }
  },
}
