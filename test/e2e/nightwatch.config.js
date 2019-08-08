// yarn nightwatch -e chrome,safari,firefox

module.exports = {
  src_folders: ['test/e2e/specs'],
  output_folder: 'test/e2e/reports',
  custom_commands_path: ['node_modules/nightwatch-helpers/commands'],
  custom_assertions_path: ['node_modules/nightwatch-helpers/assertions'],
  // set to true when testing on multiple browsers (-e chrome,firefox) to display tests as they pass instead of waiting for everything to be finished
  live_output: false,

  selenium: {
    start_process: true,
    server_path: require('selenium-server').path,
    host: '127.0.0.1',
    port: 4444,
    cli_args: {
      'webdriver.chrome.driver': require('chromedriver').path,
      'webdriver.gecko.driver': require('geckodriver').path
    }
  },

  test_settings: {
    default: {
      selenium_port: 4444,
      selenium_host: 'localhost',
      silent: true,
      screenshots: {
        enabled: true,
        on_failure: true,
        on_error: false,
        path: 'test/e2e/screenshots'
      },
      desiredCapabilities: {
        browserName: 'chrome',
        acceptSslCerts: true,
        chromeOptions: {
          // https://github.com/nightwatchjs/nightwatch/releases/tag/v1.1.12
          w3c: false,
          args: ['window-size=1280,800', 'headless']
        }
      }
    },

    chrome: {
      desiredCapabilities: {
        browserName: 'chrome',
        acceptSslCerts: true,
        chromeOptions: {
          // https://github.com/nightwatchjs/nightwatch/releases/tag/v1.1.12
          w3c: false,
          args: ['window-size=1280,800']
        }
      }
    },

    safari: {
      desiredCapabilities: {
        browserName: 'safari',
        acceptSslCerts: true
      }
    },

    firefox: {
      desiredCapabilities: {
        browserName: 'firefox',
        acceptSslCerts: true
      }
    },

    ie: {
      desiredCapabilities: {
        browser: 'internet explorer'
      }
    }
  }
}
