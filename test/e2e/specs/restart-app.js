const bsStatus = require('../browserstack-send-status')

module.exports = {
  ...bsStatus(),

  '@tags': ['history'],

  basic: function (browser) {
    browser
      .url('http://localhost:8080/restart-app/')
      .waitForElementVisible('#mount', 1000)
      .assert.containsText('#beforeEach', '0')
      .assert.containsText('#beforeResolve', '0')
      .assert.containsText('#afterEach', '0')

      // Mounting will trigger hooks
      .click('#mount')
      .waitForElementVisible('#app > *', 1000)
      .assert.containsText('#beforeEach', '1')
      .assert.containsText('#beforeResolve', '1')
      .assert.containsText('#afterEach', '1')
      .assert.containsText('#view', 'home')

      // Navigate to foo route will trigger hooks
      .click('#app li:nth-child(2) a')
      .assert.containsText('#beforeEach', '2')
      .assert.containsText('#beforeResolve', '2')
      .assert.containsText('#afterEach', '2')
      .assert.containsText('#view', 'foo')

      // Unmount
      .click('#unmount')
      .assert.containsText('#app', '')

      // Second mounting will trigger hooks
      .click('#mount')
      .waitForElementVisible('#app > *', 1000)
      .assert.containsText('#beforeEach', '3')
      .assert.containsText('#beforeResolve', '3')
      .assert.containsText('#afterEach', '3')
      .assert.containsText('#view', 'foo')

      .end()
  }
}
