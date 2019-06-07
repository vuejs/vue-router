const { resolve } = require('path')
const Nightwatch = require('nightwatch')
const args = process.argv.slice(2)

// if we are running yarn dev locally, we can pass --dev to avoid launching another server instance
const server =
  args.indexOf('--dev') > -1 ? null : require('../../examples/server')

const DEFAULT_CONFIG = './nightwatch.json'

// read the CLI arguments
Nightwatch.cli(function (argv) {
  // take every remaining argument and treat it as a test file
  // this allows to run `node test/e2e/runner.js test/e2e/basic.js`
  argv.test = argv['_'].slice(0)

  // add a configuration by default if not provided
  if (argv.c === DEFAULT_CONFIG && argv.config === DEFAULT_CONFIG) {
    argv.config = resolve(__dirname, './nightwatch.config.js')
  }
  // Nightwatch does not accept an array with one element
  if (argv.test.length === 1) argv.test = argv.test[0]

  // create the Nightwatch CLI runner
  const runner = Nightwatch.CliRunner(argv)

  // setup and run tests
  runner
    .setup()
    .startWebDriver()
    .then(() => runner.runTests())
    .then(() => {
      runner.stopWebDriver()
      server && server.close()
      process.exit(0)
    })
    .catch(err => {
      server && server.close()
      console.error(err)
      process.exit(1)
    })
})
