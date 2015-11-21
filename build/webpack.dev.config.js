module.exports = {
  entry: './src/index.js',
  output: {
    path: './dist',
    filename: 'vue-router.js',
    library: 'VueRouter',
    libraryTarget: 'umd'
  },
  module: {
    loaders: [
      {
        test: /.js/,
        exclude: /node_modules|vue\/dist/,
        loader: 'babel?optional[]=runtime&loose=all'
      }
    ]
  },
  devtool: '#source-map'
}
