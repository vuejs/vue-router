module.exports = {
  'nested routes': function (browser) {
    browser
    .url('http://localhost:8080/nested-routes/')
      .waitForElementVisible('#app', 1000)
      .assert.count('li a', 4)
      .assert.urlEquals('http://localhost:8080/nested-routes/parent')
      .assert.containsText('.view', 'Parent')
      .assert.containsText('.view', 'default')

      .click('li:nth-child(2) a')
      .assert.urlEquals('http://localhost:8080/nested-routes/parent/foo')
      .assert.containsText('.view', 'Parent')
      .assert.containsText('.view', 'foo')

      .click('li:nth-child(3) a')
      .assert.urlEquals('http://localhost:8080/nested-routes/parent/bar')
      .assert.containsText('.view', 'Parent')
      .assert.containsText('.view', 'bar')

      .click('li:nth-child(4) a')
      .assert.urlEquals('http://localhost:8080/nested-routes/baz')
      .assert.containsText('.view', 'Parent')
      .assert.containsText('.view', 'baz')

    // check initial visit
    .url('http://localhost:8080/nested-routes/parent/foo')
      .waitForElementVisible('#app', 1000)
      .assert.containsText('.view', 'Parent')
      .assert.containsText('.view', 'foo')
    .url('http://localhost:8080/nested-routes/baz')
      .waitForElementVisible('#app', 1000)
      .assert.containsText('.view', 'Parent')
      .assert.containsText('.view', 'baz')
      .end()
  }
}
