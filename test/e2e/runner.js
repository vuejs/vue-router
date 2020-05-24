/**
 * Running tests
 *
 * By default tests are run locally on chrome headless
 * $ node test/e2e/runner.js
 *
 * You can run a specific test by passing it, or pass various tests
 * $ node test/e2e/runner.js test/e2e/specs/basic.js test/e2e/specs/redirect.js
 *
 * You can specify a list of browsers to run from nightwatch.config.js with -e separated by a comma
 * $ node test/e2e/runner.js -e safari,firefox
 *
 * If you are already running the dev server with `yarn run serve`, you can pass the --dev option to avoid launching the server
 * $ node test/e2e/runner.js --dev
 * **Make sure to pass the option at the end**
 *
 * __For maintainers only__
 * You can trigger tests on Browserstack on other browsers by passing the --local option
 * It's also required to pass the list of browsers to test on to avoid launching too many tests. Available options are located inside nightwatch.browserstack.js
 * $ node test/e2e/runner.js --local -e ie,chrome50
 */

require('dotenv').config()
const { resolve } = require('path')
const Nightwatch = require('nightwatch')
const args = process.argv.slice(2)

// if we are running yarn dev locally, we can pass --dev to avoid launching another server instance
const server =
  args.indexOf('--dev') > -1 ? null : require('../../examples/server')

// allow running browserstack local
const isLocal = args.indexOf('--local') > -1

const DEFAULT_CONFIG = './nightwatch.json'
const NW_CONFIG = isLocal
  ? resolve(__dirname, './nightwatch.browserstack.js')
  : resolve(__dirname, './nightwatch.config.js')

// check -c option is passed when usig multiple environments
if (args.indexOf('-c') < 0) {
  // check if multiple envs are provided. The way Nightwatch works
  // requires to explicitely provide the conf
  const envs = args[args.indexOf('-e') + 1]
  if (envs && envs.indexOf(',') > -1) {
    console.warn(
      `Specify the conf when providing multiple browsers:\n$ yarn run test:e2e ${args.join(
        ' '
      )} -c ${NW_CONFIG}`
    )
    process.exit(1)
  }
} else if (isLocal) {
  const conf = args[args.indexOf('-c') + 1]
  if (resolve('.', conf) !== NW_CONFIG) {
    console.warn('The passed config should be', NW_CONFIG)
    process.exit(1)
  }
}

function adaptArgv (argv) {
  // take every remaining argument and treat it as a test file
  // this allows to run `node test/e2e/runner.js test/e2e/basic.js`
  argv.retries = 1
  argv.test = argv['_'].slice(0)

  if (argv.c === DEFAULT_CONFIG && argv.config === DEFAULT_CONFIG) {
    argv.config = argv.c = NW_CONFIG
  }
  // Nightwatch does not accept an array with one element
  if (argv.test.length === 1) argv.test = argv.test[0]

  // debugging easily
  // console.log(argv)
  // process.exit(0)
}

process.mainModule.filename = resolve(
  __dirname,
  '../../node_modules/.bin/nightwatch'
)

if (isLocal) {
  if (isLocal && (!process.env.BS_USER || !process.env.BS_KEY)) {
    console.log(
      'Hey!\n',
      'You are missing credentials for Browserstack.\n',
      'If you are a contributor, this is normal, credentials are private. These tests must be run by a maintainer of vue-router',
      'If you are a maintainer, make sure to create your `.env` file with both `BS_USER` and `BS_KEY` variables!'
    )
    // fail if testing locally
    process.exit(process.env.CI ? 0 : 1)
  }

  let bsLocal
  const browserstack = require('browserstack-local')
  Nightwatch.bs_local = bsLocal = new browserstack.Local()
  bsLocal.start({ key: process.env.BS_KEY }, error => {
    if (error) throw error

    console.log('Connected. Now testing...')
    try {
      Nightwatch.cli(argv => {
        adaptArgv(argv)
        Nightwatch.CliRunner(argv)
          .setup(null, () => {
            // NOTE: I don't know when this is running or if it does
            // Code to stop browserstack local after end of parallel test
            bsLocal.stop(() => {
              server && server.close()
              process.exit(0)
            })
          })
          .runTests()
          .then(() => {
            // Code to stop browserstack local after end of single test
            bsLocal.stop(() => {
              server && server.close()
              process.exit(0)
            })
          })
          .catch(() => {
            server && server.close()
            // fail execution
            process.exit(1)
          })
      })
    } catch (err) {
      console.error(err)
      bsLocal.stop(() => {
        process.exit(1)
      })
    }
  })
} else {
  // create the Nightwatch CLI runner
  Nightwatch.cli(argv => {
    adaptArgv(argv)
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
}
