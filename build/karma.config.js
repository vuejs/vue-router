module.exports = function (config) {
  config.set({
    browsers: ['PhantomJS'],
    reporters: ['spec', 'coverage'],
    frameworks: ['jasmine'],
    files: ['../test/unit/specs/index.js'],
    preprocessors: {
      '../test/unit/specs/index.js': ['webpack']
    },
    webpack: {
      module: {
        loaders: [
          {
            test: /\.js$/,
            exclude: /test|node_modules|vue\/src/,
            loader: 'babel?optional[]=runtime'
          }
        ],
        postLoaders: [
          {
            test: /\.js$/,
            exclude: /test|node_modules|vue\/src/,
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
