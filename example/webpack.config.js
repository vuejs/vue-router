module.exports = {
  entry: {
    app: ['webpack/hot/dev-server', './example/index.js']
  },
  output: {
    path: './example',
    filename: 'example.build.js'
  },
  module: {
    loaders: [
      { test: /\.vue$/, loader: 'vue' }
    ]
  },
  devtool: 'source-map'
}
