module.exports = {
  entry: {
    app: ['webpack/hot/dev-server', './example/advanced/index.js']
  },
  output: {
    path: './example/advanced',
    filename: 'example.build.js'
  },
  module: {
    loaders: [
      { test: /\.vue$/, loader: 'vue' }
    ]
  },
  devtool: 'source-map'
}
