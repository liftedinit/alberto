const webpack = require("webpack")

module.exports = {
  webpack: function override(webpackConfig) {
    webpackConfig.module.rules.push({
      test: /\.(js|mjs|jsx)$/,
      enforce: "pre",
      loader: require.resolve("source-map-loader"),
      resolve: {
        fullySpecified: false,
      },
    })

    // Ignore specific warnings
    if (!webpackConfig.ignoreWarnings) {
      webpackConfig.ignoreWarnings = []
    }

    webpackConfig.ignoreWarnings.push(/Failed to parse source map/)

    if (!webpackConfig.resolve.fallback) {
      webpackConfig.resolve.fallback = {}
    }

    webpackConfig.resolve = {
      ...webpackConfig.resolve, // Spread in existing resolve config
      fallback: {
        ...webpackConfig.resolve.fallback, // Spread in existing fallback config if any
        crypto: false,
        buffer: require.resolve("buffer/"),
        assert: false,
        http: false,
        https: false,
        os: false,
        url: false,
        zlib: false,
        stream: require.resolve("stream-browserify"),
      },
    }

    // Provide Plugin to make Buffer globally available in your app
    webpackConfig.plugins = (webpackConfig.plugins || []).concat([
      new webpack.ProvidePlugin({
        Buffer: ["buffer", "Buffer"],
        process: "process/browser",
      }),
    ])

    return webpackConfig
  },
  devServer: function (configDevServer) {
    return function (proxy, allowedHosts) {
      return configDevServer(proxy, allowedHosts)
    }
  },
}
