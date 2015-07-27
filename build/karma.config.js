module.exports = function (config) {
  config.set({
    browsers: ['Chrome', 'Firefox'],
    reporters: ['progress'],
    frameworks: ['jasmine'],
    files: ['../test/test.js'],
    preprocessors: {
      '../test/test.js': ['webpack']
    },
    webpackMiddleware: {
      noInfo: true
    },
    singleRun: true
  })
}
