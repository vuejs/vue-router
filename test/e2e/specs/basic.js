const bsStatus = require('../browserstack-send-status')

module.exports = {
  ...bsStatus(),

  '@tags': ['history'],

  basic: function (browser) {
    browser
      .url('http://localhost:8080/basic/')
      .waitForElementVisible('#app', 1000)
      .assert.count('li', 9)
      .assert.count('li a', 9)
      // assert correct href with base
      .assert.attributeContains('li:nth-child(1) a', 'href', '/basic/')
      .assert.attributeContains('li:nth-child(2) a', 'href', '/basic/foo')
      .assert.attributeContains('li:nth-child(3) a', 'href', '/basic/bar')
      .assert.attributeContains('li:nth-child(4) a', 'href', '/basic/bar')
      .assert.attributeContains('li:nth-child(5) a', 'href', '/basic/%C3%A9')
      .assert.attributeContains('li:nth-child(6) a', 'href', '/basic/%C3%A9?t=%25%C3%B1')
      .assert.attributeContains('li:nth-child(7) a', 'href', '/basic/%C3%A9#%25%C3%B1')
      .assert.attributeContains('li:nth-child(8) a', 'href', '/basic/foo')
      .assert.containsText('.view', 'home')

      .click('li:nth-child(2) a')
      .assert.urlEquals('http://localhost:8080/basic/foo')
      .assert.containsText('.view', 'foo')

      .click('li:nth-child(3) a')
      .assert.urlEquals('http://localhost:8080/basic/bar')
      .assert.containsText('.view', 'bar')

      .click('li:nth-child(1) a')
      .assert.urlEquals('http://localhost:8080/basic/')
      .assert.containsText('.view', 'home')

      .click('li:nth-child(4) a')
      .assert.urlEquals('http://localhost:8080/basic/bar')
      .assert.containsText('.view', 'bar')

      .click('li:nth-child(5) a')
      .assert.urlEquals('http://localhost:8080/basic/%C3%A9')
      .assert.containsText('.view', 'unicode')

      // check initial visit
      .url('http://localhost:8080/basic/foo')
      .waitForElementVisible('#app', 1000)
      .assert.containsText('.view', 'foo')
      .url('http://localhost:8080/basic/%C3%A9')
      .waitForElementVisible('#app', 1000)
      .assert.containsText('.view', 'unicode')

      // regression onComplete
      // https://github.com/vuejs/vue-router/issues/2721
      .assert.containsText('#counter', '0')
      .click('#navigate-btn')
      .assert.containsText('#counter', '1')
      .click('#navigate-btn')
      .assert.containsText('#counter', '2')

      // scoped slot
      .assert.containsText('li:nth-child(8) a', '/foo (with v-slot)')
      .click('li:nth-child(8) a')
      .assert.urlEquals('http://localhost:8080/basic/foo')
      .assert.containsText('.view', 'foo')
      .click('li:nth-child(2) a')
      .assert.urlEquals('http://localhost:8080/basic/foo')
      .assert.containsText('.view', 'foo')
      .assert.cssClassPresent('li:nth-child(8)', 'active')
      .assert.cssClassPresent('li:nth-child(8)', 'exact-active')
      .assert.attributeEquals('li:nth-child(8) a', 'class', '')

      .end()
  }
}
