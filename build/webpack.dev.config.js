module.exports = {
  entry: './example/example.js',
  output: {
    path: './example',
    filename: 'example.build.js'
  },
  module: {
    loaders: [
      { test: /\.vue$/, loader: 'vue' }
    ]
  },
  devtool: '#source-map'
}
