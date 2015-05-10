var webpack = require("webpack")
var version = require('../package.json').version
var banner =
  '/**\n' +
  ' * vue-router v' + version + '\n' +
  ' * (c) ' + new Date().getFullYear() + ' Evan You\n' +
  ' * Released under the MIT License.\n' +
  ' */\n'

module.exports = {
  entry: './src/index.js',
  output: {
    path: './dist',
    filename: 'vue-router.js',
    library: 'VueRouter',
    libraryTarget: 'umd'
  },
  plugins: [
    new webpack.BannerPlugin(banner, { raw: true })
  ]
}