module.exports = function (config) {
  config.set({
    browsers: ['PhantomJS'],
    reporters: ['progress'],
    frameworks: ['jasmine'],
    files: [__dirname + '/../test/test.build.js'],
    singleRun: true
  })
}
