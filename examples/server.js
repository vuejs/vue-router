const express = require('express')
const rewrite = require('express-urlrewrite')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const WebpackConfig = require('./webpack.config')

const app = express()

app.use(
  webpackDevMiddleware(webpack(WebpackConfig), {
    publicPath: '/__build__/',
    stats: {
      colors: true,
      chunks: false
    }
  })
)

const fs = require('fs')
const path = require('path')

fs.readdirSync(__dirname).forEach(file => {
  if (fs.statSync(path.join(__dirname, file)).isDirectory()) {
    app.use(rewrite('/' + file + '/*', '/' + file + '/index.html'))
  }
})

app.use(express.static(__dirname))

const host = process.env.HOST || 'localhost'
const port = process.env.PORT || 8080
module.exports = app.listen(port, host, () => {
  console.log(`Server listening on http://${host}:${port}, Ctrl+C to stop`)
})
