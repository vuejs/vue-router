module.exports = {
  'named views': function (browser) {
    browser
      .url('http://localhost:8080/named-views/')
      .waitForElementVisible('#app', 1000)
      .assert.count('li a', 2)
      // assert correct href with base
      .assert.attributeContains('li:nth-child(1) a', 'href', '/named-views/')
      .assert.attributeContains('li:nth-child(2) a', 'href', '/named-views/other')

      .assert.containsText('.view.one', 'foo')
      .assert.containsText('.view.two', 'bar')
      .assert.containsText('.view.three', 'baz')

      .click('li:nth-child(2) a')
      .assert.urlEquals('http://localhost:8080/named-views/other')
      .assert.containsText('.view.one', 'baz')
      .assert.containsText('.view.two', 'bar')
      .assert.containsText('.view.three', 'foo')

      .click('li:nth-child(1) a')
      .assert.urlEquals('http://localhost:8080/named-views/')
      .assert.containsText('.view.one', 'foo')
      .assert.containsText('.view.two', 'bar')
      .assert.containsText('.view.three', 'baz')

    // check initial visit
      .url('http://localhost:8080/named-views/other')
      .waitForElementVisible('#app', 1000)
      .assert.containsText('.view.one', 'baz')
      .assert.containsText('.view.two', 'bar')
      .assert.containsText('.view.three', 'foo')
      .end()
  }
}
