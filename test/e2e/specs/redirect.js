module.exports = {
  'redirect': function (browser) {
    browser
    .url('http://localhost:8080/redirect/')
      .waitForElementVisible('#app', 1000)
      .assert.count('li a', 12)
      // assert correct href with base
      .assert.attributeContains('li:nth-child(1) a', 'href', '/redirect/relative-redirect')
      .assert.attributeContains('li:nth-child(2) a', 'href', '/redirect/relative-redirect?foo=bar')
      .assert.attributeContains('li:nth-child(3) a', 'href', '/redirect/absolute-redirect')
      .assert.attributeContains('li:nth-child(4) a', 'href', '/redirect/dynamic-redirect')
      .assert.attributeContains('li:nth-child(5) a', 'href', '/redirect/dynamic-redirect/123')
      .assert.attributeContains('li:nth-child(6) a', 'href', '/redirect/dynamic-redirect?to=foo')
      .assert.attributeContains('li:nth-child(7) a', 'href', '/redirect/dynamic-redirect#baz')
      .assert.attributeContains('li:nth-child(8) a', 'href', '/redirect/named-redirect')
      .assert.attributeContains('li:nth-child(9) a', 'href', '/redirect/redirect-with-params/123')
      .assert.attributeContains('li:nth-child(10) a', 'href', '/redirect/foobar')
      .assert.attributeContains('li:nth-child(11) a', 'href', '/redirect/FooBar')
      .assert.attributeContains('li:nth-child(12) a', 'href', '/not-found')

      .assert.containsText('.view', 'default')

      .click('li:nth-child(1) a')
      .assert.urlEquals('http://localhost:8080/redirect/foo')
      .assert.containsText('.view', 'foo')

      .click('li:nth-child(2) a')
      .assert.urlEquals('http://localhost:8080/redirect/foo?foo=bar')
      .assert.containsText('.view', 'foo')

      .click('li:nth-child(3) a')
      .assert.urlEquals('http://localhost:8080/redirect/bar')
      .assert.containsText('.view', 'bar')

      .click('li:nth-child(4) a')
      .assert.urlEquals('http://localhost:8080/redirect/bar')
      .assert.containsText('.view', 'bar')

      .click('li:nth-child(5) a')
      .assert.urlEquals('http://localhost:8080/redirect/with-params/123')
      .assert.containsText('.view', '123')

      .click('li:nth-child(6) a')
      .assert.urlEquals('http://localhost:8080/redirect/foo')
      .assert.containsText('.view', 'foo')

      .click('li:nth-child(7) a')
      .assert.urlEquals('http://localhost:8080/redirect/baz')
      .assert.containsText('.view', 'baz')

      .click('li:nth-child(8) a')
      .assert.urlEquals('http://localhost:8080/redirect/baz')
      .assert.containsText('.view', 'baz')

      .click('li:nth-child(9) a')
      .assert.urlEquals('http://localhost:8080/redirect/with-params/123')
      .assert.containsText('.view', '123')

      .click('li:nth-child(10) a')
      .assert.urlEquals('http://localhost:8080/redirect/foobar')
      .assert.containsText('.view', 'foobar')

      .click('li:nth-child(11) a')
      .assert.urlEquals('http://localhost:8080/redirect/FooBar')
      .assert.containsText('.view', 'FooBar')

      .click('li:nth-child(12) a')
      .assert.urlEquals('http://localhost:8080/redirect/')
      .assert.containsText('.view', 'default')

    // check initial visit
    .url('http://localhost:8080/redirect/relative-redirect')
      .waitForElementVisible('#app', 1000)
      .assert.urlEquals('http://localhost:8080/redirect/foo')
      .assert.containsText('.view', 'foo')

    .url('http://localhost:8080/redirect/relative-redirect?foo=bar')
      .waitForElementVisible('#app', 1000)
      .assert.urlEquals('http://localhost:8080/redirect/foo?foo=bar')
      .assert.containsText('.view', 'foo')

    .url('http://localhost:8080/redirect/absolute-redirect')
      .waitForElementVisible('#app', 1000)
      .assert.urlEquals('http://localhost:8080/redirect/bar')
      .assert.containsText('.view', 'bar')

    .url('http://localhost:8080/redirect/dynamic-redirect')
      .waitForElementVisible('#app', 1000)
      .assert.urlEquals('http://localhost:8080/redirect/bar')
      .assert.containsText('.view', 'bar')

    .url('http://localhost:8080/redirect/dynamic-redirect/123')
      .waitForElementVisible('#app', 1000)
      .assert.urlEquals('http://localhost:8080/redirect/with-params/123')
      .assert.containsText('.view', '123')

    .url('http://localhost:8080/redirect/dynamic-redirect?to=foo')
      .waitForElementVisible('#app', 1000)
      .assert.urlEquals('http://localhost:8080/redirect/foo')
      .assert.containsText('.view', 'foo')

    .url('http://localhost:8080/redirect/dynamic-redirect#baz')
      .waitForElementVisible('#app', 1000)
      .assert.urlEquals('http://localhost:8080/redirect/baz')
      .assert.containsText('.view', 'baz')

    .url('http://localhost:8080/redirect/named-redirect')
      .waitForElementVisible('#app', 1000)
      .assert.urlEquals('http://localhost:8080/redirect/baz')
      .assert.containsText('.view', 'baz')

    .url('http://localhost:8080/redirect/redirect-with-params/123')
      .waitForElementVisible('#app', 1000)
      .assert.urlEquals('http://localhost:8080/redirect/with-params/123')
      .assert.containsText('.view', '123')

    .url('http://localhost:8080/redirect/foobar')
      .waitForElementVisible('#app', 1000)
      .assert.urlEquals('http://localhost:8080/redirect/foobar')
      .assert.containsText('.view', 'foobar')

    .url('http://localhost:8080/redirect/FooBar')
      .waitForElementVisible('#app', 1000)
      .assert.urlEquals('http://localhost:8080/redirect/FooBar')
      .assert.containsText('.view', 'FooBar')

    .url('http://localhost:8080/redirect/not-found')
      .waitForElementVisible('#app', 1000)
      .assert.urlEquals('http://localhost:8080/redirect/')
      .assert.containsText('.view', 'default')
      .end()
  }
}
