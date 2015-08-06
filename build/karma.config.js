module.exports = function (config) {
  config.set({
    browsers: ['Chrome'],
    reporters: ['spec', 'coverage'],
    frameworks: ['jasmine'],
    files: ['../test/unit/test.js'],
    preprocessors: {
      '../test/unit/test.js': ['webpack']
    },
    webpack: {
      module: {
        postLoaders: [
          {
            test: /\.js$/,
            exclude: /(test|node_modules|vue\/src)\/|history\/html5\.js/,
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
