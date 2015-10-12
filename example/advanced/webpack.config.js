var vue = require('vue-loader')

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
        loader: vue.withLoaders({
          js: 'babel?optional[]=runtime'
        })
      },
      {
        test: /\.js$/,
        exclude: /node_modules|vue\/src/,
        loader: 'babel?optional[]=runtime&loose=true'
      }
    ]
  },
  devtool: 'source-map'
}
