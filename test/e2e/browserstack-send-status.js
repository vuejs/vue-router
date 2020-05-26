const axios = require('axios')

const BS_USER = process.env.BS_USER
const BS_KEY = process.env.BS_KEY

function getKey (client) {
  // const { capabilities, currentTest } = client
  // originally i wanted to use this but it turns out the information changes
  // on the afterEach, making the key non valid. But because every environment
  // runs on a different thread, the sessionMap object is only shared for a given
  // environment, so only using the name of the test (currentTest.module) seems to be
  // enough
  // return `${capabilities.platform}::${capabilities.browserName}@${
  //   capabilities.version
  // } ${currentTest.module}: ${currentTest.name}`

  return `${client.currentTest.module}: ${client.currentTest.name}`
}

function shouldSkipBrowserstackReporting (client) {
  return !BS_USER || !BS_KEY || client.options.selenium_port !== 80
}

/**
 * Generates an object with beforeEach and afterEach functions to be added
 * to every test suite. It cannot be added globably because these must be
 * executed before each test (instead of each test suite as it does in globalModules)
 */
module.exports = function sendStatus () {
  const sessionMap = Object.create(null)

  return {
    beforeEach (browser, cb) {
      // avoid running if missing credentials
      if (shouldSkipBrowserstackReporting(this.client)) return cb()
      // retrieve the session and save it to the map
      const key = getKey(this.client)
      browser.session(({ sessionId }) => {
        sessionMap[key] = sessionId
        cb()
      })
    },

    afterEach (browser, cb) {
      // avoid running if missing credentials
      if (shouldSkipBrowserstackReporting(this.client)) return cb()
      const key = getKey(this.client)
      const { results } = this.client.currentTest
      const sessionId = sessionMap[key]

      if (!sessionId) {
        console.warn('❌ Cannot find sessionId for ' + key)
        return cb()
      }

      if (results.errors > 0 || results.failed > 0) {
        const reason = results.lastError.message
        console.log('Found failed test', reason)
        axios
          .put(
            `https://api.browserstack.com/automate/sessions/${sessionId}.json`,
            {
              // change the name so it's easier to find
              name: key,
              status: 'failed',
              reason
            },
            {
              auth: {
                username: BS_USER,
                password: BS_KEY
              }
            }
          )
          .catch(err => {
            console.log('❌ Failed changing status for sessions', err)
          })
          .then(() => {
            console.log('✅ Sent for', sessionId)
            cb()
          })
      } else {
        cb()
      }
    }
  }
}
