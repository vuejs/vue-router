module.exports = {
  'Hash mode': function (browser) {
    browser
    .url('http://localhost:8080/hash-mode/')
      .waitForElementVisible('#app', 1000)
      .assert.count('li', 5)
      .assert.count('li a', 4)
      .assert.attributeContains('li:nth-child(1) a', 'href', '/hash-mode/#/')
      .assert.attributeContains('li:nth-child(2) a', 'href', '/hash-mode/#/foo')
      .assert.attributeContains('li:nth-child(3) a', 'href', '/hash-mode/#/bar')
      .assert.attributeContains('li:nth-child(5) a', 'href', '/hash-mode/#/%C3%A9')
      .assert.containsText('.view', 'home')

      .click('li:nth-child(2) a')
      .assert.urlEquals('http://localhost:8080/hash-mode/#/foo')
      .assert.containsText('.view', 'foo')

      .click('li:nth-child(3) a')
      .assert.urlEquals('http://localhost:8080/hash-mode/#/bar')
      .assert.containsText('.view', 'bar')

      .click('li:nth-child(1) a')
      .assert.urlEquals('http://localhost:8080/hash-mode/#/')
      .assert.containsText('.view', 'home')

      .click('li:nth-child(4)')
      .assert.urlEquals('http://localhost:8080/hash-mode/#/bar')
      .assert.containsText('.view', 'bar')

    // check initial visit
    .url('http://localhost:8080/hash-mode/#/foo')
      .waitForElementVisible('#app', 1000)
      .assert.containsText('.view', 'foo')
    .url('http://localhost:8080/hash-mode/#/%C3%A9')
      .waitForElementVisible('#app', 1000)
      .assert.containsText('.view', 'unicode')
      .end()
  }
}
