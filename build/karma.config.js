module.exports = function (config) {
  config.set({
    browsers: ['PhantomJS'],
    reporters: ['spec', 'coverage'],
    frameworks: ['jasmine'],
    files: ['../test/unit/specs/index.js'],
    preprocessors: {
      '../test/unit/specs/index.js': ['webpack', 'sourcemap']
    },
    webpack: {
      devtool: '#inline-source-map',
      module: {
        loaders: [
          {
            test: /\.js$/,
            exclude: /test|node_modules|vue\/dist/,
            loader: 'babel?optional[]=runtime&loose=all'
          }
        ],
        postLoaders: [
          {
            test: /\.js$/,
            exclude: /test|node_modules|vue\/dist|lib\//,
            loader: 'istanbul-instrumenter'
          }
        ]
      }
    },
    webpackMiddleware: {
      noInfo: true
    },
    singleRun: true,
    coverageReporter: {
      reporters: [
        { type: 'lcov', dir: '../coverage', subdir: '.' },
        { type: 'text-summary', dir: '../coverage', subdir: '.' }
      ]
    }
  })
}
