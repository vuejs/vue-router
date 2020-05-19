const bsStatus = require('../browserstack-send-status')

module.exports = {
  ...bsStatus(),

  '@tags': ['history'],

  basic: function (browser) {
    browser
      .url('http://localhost:8080/multi-app/')
      .waitForElementVisible('#mount1', 1000)
      .assert.containsText('#popcount', '0')
      .click('#mount1')
      .waitForElementVisible('#app-1 > *', 1000)
      .assert.containsText('#popcount', '1')
      .click('#mount2')
      .waitForElementVisible('#app-2 > *', 1000)
      .assert.containsText('#popcount', '2')
      .click('#mount3')
      .waitForElementVisible('#app-3 > *', 1000)
      .assert.containsText('#popcount', '3')

      // They should all be displaying the home page
      .assert.containsText('#app-1', 'home')
      .assert.containsText('#app-2', 'home')
      .assert.containsText('#app-3', 'home')

      // Navigate to foo route
      .click('#app-1 li:nth-child(2) a')
      .assert.containsText('#app-1', 'foo')

      .click('#app-2 li:nth-child(2) a')
      .assert.containsText('#app-2', 'foo')

      .click('#app-3 li:nth-child(2) a')
      .assert.containsText('#app-3', 'foo')

      // Unmount all apps
      .assert.containsText('#popcount', '3')
      .click('#unmount1')
      .assert.containsText('#popcount', '2')
      .click('#unmount2')
      .assert.containsText('#popcount', '1')
      .click('#unmount3')
      .assert.containsText('#popcount', '0')

      .end()
  }
}
