var path = require('path')
var spawn = require('cross-spawn')
var server = process.env.DEV ? null : require('../../examples/server')

var args = process.argv.slice(2)
if (args.indexOf('--config') === -1) {
  args = args.concat(['--config', 'test/e2e/nightwatch.config.js'])
}
if (args.indexOf('--env') === -1) {
  args = args.concat(['--env', process.env.CIRCLECI ? 'phantomjs' : 'chrome'])
}
var i = args.indexOf('--test')
if (i > -1) {
  args[i + 1] = 'test/e2e/specs/' + args[i + 1]
}
if (args.indexOf('phantomjs') > -1) {
  process.env.PHANTOMJS = true
}

var runner = spawn('./node_modules/.bin/nightwatch', args, {
  stdio: 'inherit'
})

runner.on('exit', function (code) {
  server && server.close()
  process.exit(code)
})

runner.on('error', function (err) {
  server && server.close()
  throw err
})
