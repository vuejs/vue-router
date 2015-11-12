module.exports = {
  entry: './test/unit/specs/index.js',
  output: {
    path: './test/unit',
    filename: 'specs.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /test|node_modules|vue\/src/,
        loader: 'babel'
      }
    ]
  },
  babel: {
    presets: ['es2015', 'stage-0'],
    plugins: ['transform-runtime']
  }
}
