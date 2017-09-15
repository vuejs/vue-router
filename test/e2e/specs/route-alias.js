module.exports = {
  'route alias': function (browser) {
    browser
    .url('http://localhost:8080/route-alias/')
      .waitForElementVisible('#app', 1000)
      .assert.count('li a', 7)
      // assert correct href with base
      .assert.attributeContains('li:nth-child(1) a', 'href', '/root-alias')
      .assert.attributeContains('li:nth-child(2) a', 'href', '/route-alias/foo')
      .assert.attributeContains('li:nth-child(3) a', 'href', '/route-alias/home/bar-alias')
      .assert.attributeContains('li:nth-child(4) a', 'href', '/route-alias/baz')
      .assert.attributeContains('li:nth-child(5) a', 'href', '/route-alias/home/baz-alias')
      .assert.attributeEquals('li:nth-child(6) a', 'href', 'http://localhost:8080/route-alias/home')
      .assert.attributeContains('li:nth-child(7) a', 'href', '/route-alias/home/nested-alias/foo')

      .click('li:nth-child(1) a')
      .assert.urlEquals('http://localhost:8080/route-alias/root-alias')
      .assert.containsText('.view', 'root')

      .click('li:nth-child(2) a')
      .assert.urlEquals('http://localhost:8080/route-alias/foo')
      .assert.containsText('.view', 'Home')
      .assert.containsText('.view', 'foo')

      .click('li:nth-child(3) a')
      .assert.urlEquals('http://localhost:8080/route-alias/home/bar-alias')
      .assert.containsText('.view', 'Home')
      .assert.containsText('.view', 'bar')

      .click('li:nth-child(4) a')
      .assert.urlEquals('http://localhost:8080/route-alias/baz')
      .assert.containsText('.view', 'Home')
      .assert.containsText('.view', 'baz')

      .click('li:nth-child(5) a')
      .assert.urlEquals('http://localhost:8080/route-alias/home/baz-alias')
      .assert.containsText('.view', 'Home')
      .assert.containsText('.view', 'baz')

      .click('li:nth-child(6) a')
      .assert.urlEquals('http://localhost:8080/route-alias/home')
      .assert.containsText('.view', 'Home')
      .assert.containsText('.view', 'default')

      .click('li:nth-child(7) a')
      .assert.urlEquals('http://localhost:8080/route-alias/home/nested-alias/foo')
      .assert.containsText('.view', 'Home')
      .assert.containsText('.view', 'nested foo')

    // check initial visit
    .url('http://localhost:8080/route-alias/foo')
      .waitForElementVisible('#app', 1000)
      .assert.urlEquals('http://localhost:8080/route-alias/foo')
      .assert.containsText('.view', 'Home')
      .assert.containsText('.view', 'foo')

    .url('http://localhost:8080/route-alias/home/bar-alias')
      .waitForElementVisible('#app', 1000)
      .assert.urlEquals('http://localhost:8080/route-alias/home/bar-alias')
      .assert.containsText('.view', 'Home')
      .assert.containsText('.view', 'bar')

    .url('http://localhost:8080/route-alias/baz')
      .waitForElementVisible('#app', 1000)
      .assert.urlEquals('http://localhost:8080/route-alias/baz')
      .assert.containsText('.view', 'Home')
      .assert.containsText('.view', 'baz')

    .url('http://localhost:8080/route-alias/home/baz-alias')
      .waitForElementVisible('#app', 1000)
      .assert.urlEquals('http://localhost:8080/route-alias/home/baz-alias')
      .assert.containsText('.view', 'Home')
      .assert.containsText('.view', 'baz')

    .url('http://localhost:8080/route-alias/home')
      .waitForElementVisible('#app', 1000)
      .assert.urlEquals('http://localhost:8080/route-alias/home')
      .assert.containsText('.view', 'Home')
      .assert.containsText('.view', 'default')

    .url('http://localhost:8080/route-alias/home/nested-alias/foo')
      .waitForElementVisible('#app', 1000)
      .assert.urlEquals('http://localhost:8080/route-alias/home/nested-alias/foo')
      .assert.containsText('.view', 'Home')
      .assert.containsText('.view', 'nested foo')
      .end()
  }
}
