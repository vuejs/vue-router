module.exports = {
  'link-events': function (browser) {
    browser
    .url('http://localhost:8080/link-events/')
      .waitForElementVisible('#app', 1000)
      .assert.count('li', 4)
      .assert.count('li a', 4)
      // assert correct href with base
      .assert.attributeContains('li:nth-child(1) a', 'href', '/link-events/')
      .assert.attributeContains('li:nth-child(2) a', 'href', '/link-events/foo')
      .assert.attributeContains('li:nth-child(3) a', 'href', '/link-events/bar')
      .assert.attributeContains('li:nth-child(4) a', 'href', '/link-events/bar')
      .assert.containsText('.view', 'home')

      .click('li:nth-child(2) a')
      .acceptAlert()
      .assert.urlEquals('http://localhost:8080/link-events/foo')
      .assert.containsText('.view', 'foo')

      .click('li:nth-child(3) a')
      .assert.attributeContains('li:nth-child(3) a', 'style', 'background-color: green;')
      .assert.urlEquals('http://localhost:8080/link-events/bar')
      .assert.containsText('.view', 'bar')

      .click('li:nth-child(1) a')
      .acceptAlert()
      .assert.urlEquals('http://localhost:8080/link-events/')
      .assert.containsText('.view', 'home')

      .click('li:nth-child(4) a')
      .acceptAlert()
      .assert.urlEquals('http://localhost:8080/link-events/bar')
      .assert.containsText('.view', 'bar')

    // check initial visit
    .url('http://localhost:8080/link-events/foo')
      .waitForElementVisible('#app', 1000)
      .assert.containsText('.view', 'foo')
      .end()
  }
}
