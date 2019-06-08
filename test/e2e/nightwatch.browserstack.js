/**
 * Running tests on remote browsers
 */

const BS_USER = process.env.BS_USER
const BS_KEY = process.env.BS_KEY
const isCI = process.env.CI

if (!BS_USER || !BS_KEY) {
  console.log(
    'Hey!\n',
    'You are missing credentials for Browserstack.\n',
    'If you are a contributor, this is normal, credentials are private. These tests must be run by a maintainer of vue-router',
    'If you are a maintainer, you forgot to `source keys.env`!'
  )
  // fail if testing locally
  process.exit(isCI ? 0 : 1)
}

const nwConf = {
  src_folders: ['test/e2e/specs'],
  output_folder: 'test/e2e/reports',
  custom_commands_path: ['node_modules/nightwatch-helpers/commands'],
  custom_assertions_path: ['node_modules/nightwatch-helpers/assertions'],

  selenium: {
    start_process: false,
    host: 'hub-cloud.browserstack.com',
    port: 80
  },

  common_capabilities: {
    'browserstack.user': BS_USER,
    'browserstack.key': BS_KEY,
    name: 'Bstack-[Nightwatch] Vue Router Parallel Test',
    'browserstack.local': true,
    'browserstack.video': false,
    acceptSslCerts: true
  },

  test_settings: {
    // default: {},

    chrome: {
      desiredCapabilities: {
        browser: 'chrome'
        // name: 'Bstack-[Nightwatch] Vue Router',
      }
    },

    firefox: {
      desiredCapabilities: {
        browser: 'firefox'
      }
    },

    safari: {
      desiredCapabilities: {
        browser: 'safari'
      }
    },

    ie9: {
      desiredCapabilities: {
        browser: 'internet explorer',
        browser_version: '9'
        // name: 'Bstack-[Nightwatch] Vue Router',
        // 'browserstack.video': true
      }
    },

    ie: {
      desiredCapabilities: {
        browser: 'internet explorer',
        browser_version: '11'
        // name: 'Bstack-[Nightwatch] Vue Router',
        // 'browserstack.video': true
      }
    }
  }
}

// Code to copy seleniumhost/port into test settings
for (const setting in nwConf.test_settings) {
  const config = nwConf.test_settings[setting]
  config['selenium_host'] = nwConf.selenium.host
  config['selenium_port'] = nwConf.selenium.port

  // merge common_capabilities
  for (const key in nwConf.common_capabilities) {
    // fallback to common_capabilities
    config['desiredCapabilities'][key] =
      config['desiredCapabilities'][key] || nwConf.common_capabilities[key]
  }
}

module.exports = nwConf
