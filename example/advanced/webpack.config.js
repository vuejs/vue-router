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
      {
        test: /\.vue$/,
        loader: 'vue'
      },
      {
        test: /\.js$/,
        exclude: /node_modules|vue\/src/,
        loader: 'babel'
      }
    ]
  },
  babel: {
    presets: ['es2015', 'stage-0'],
    plugins: ['transform-runtime']
  },
  devtool: 'source-map'
}
