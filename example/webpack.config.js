module.exports = {
  entry: './example/index.js',
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
