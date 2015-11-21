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
        exclude: /node_modules|vue\/dist/,
        loader: 'babel?optional[]=runtime&loose=true'
      }
    ]
  },
  devtool: 'source-map'
}
