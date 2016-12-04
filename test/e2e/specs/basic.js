module.exports = {
  'basic': function (browser) {
    browser
    .url('http://localhost:8080/basic/')
      .waitForElementVisible('#app', 1000)
      .assert.count('li', 4)
      .assert.count('li a', 4)
      // assert correct href with base
      .assert.attributeContains('li:nth-child(1) a', 'href', '/basic/')
      .assert.attributeContains('li:nth-child(2) a', 'href', '/basic/foo')
      .assert.attributeContains('li:nth-child(3) a', 'href', '/basic/bar')
      .assert.attributeContains('li:nth-child(4) a', 'href', '/basic/bar')
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

    // check initial visit
    .url('http://localhost:8080/basic/foo')
      .waitForElementVisible('#app', 1000)
      .assert.containsText('.view', 'foo')
      .end()
  }
}
