const bsStatus = require('../browserstack-send-status')

module.exports = {
  ...bsStatus(),

  '@tags': ['history'],

  removeroutes: function (browser) {
    browser
      .url('http://localhost:8080/remove-routes/')
      .waitForElementVisible('#app', 1000)
      .assert.count('li', 2)
      .assert.attributeContains('li:nth-child(1) a', 'href', '/remove-routes/foo')
      .assert.attributeContains('li:nth-child(2) a', 'href', '/remove-routes/bar')
      .assert.urlEquals('http://localhost:8080/remove-routes/')

      .click('li:nth-child(2) a')
      .assert.urlEquals('http://localhost:8080/remove-routes/bar')
      .assert.elementNotPresent('.view')

      .click('li:nth-child(1) a')
      .assert.urlEquals('http://localhost:8080/remove-routes/foo')
      .assert.containsText('.view', 'foo')

      .click('#add-btn')
      .click('li:nth-child(2) a')
      .assert.urlEquals('http://localhost:8080/remove-routes/bar')
      .assert.containsText('.view', 'bar')

      .click('li:nth-child(1) a')
      .assert.urlEquals('http://localhost:8080/remove-routes/foo')
      .assert.containsText('.view', 'foo')

      .click('#remove-btn')
      .click('li:nth-child(2) a')
      .assert.urlEquals('http://localhost:8080/remove-routes/bar')
      .assert.containsText('.view', '')

      .end()
  }
}
