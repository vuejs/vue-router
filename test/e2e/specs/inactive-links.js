const bsStatus = require('../browserstack-send-status')

module.exports = {
  ...bsStatus(),

  '@tags': ['history', 'inactive', 'router-link'],

  'inactive links': function (browser) {
    browser
      .url('http://localhost:8080/inactive-links/')
      .waitForElementVisible('#app', 1000)
      .assert.count('li a', 2)
      // assert correct href with base
      .assert.attributeContains('li:nth-child(1) a', 'href', '/inactive-links/')
      .assert.attributeContains('li:nth-child(2) a', 'href', '/inactive-links/about')
      .assert.containsText('.view', 'Home')

    assertInactiveLinks(1, 2)
    assertInactiveLinks(2, 1)

    browser.end()

    function assertInactiveLinks (n, inactive) {
      browser.click(`li:nth-child(${n}) a`)
      browser.assert.cssClassPresent(`li:nth-child(${inactive}) a`, 'router-link-inactive')
    }
  }
}
