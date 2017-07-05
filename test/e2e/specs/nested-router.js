module.exports = {
  'basic': function (browser) {
    browser
    .url('http://localhost:8080/nested-router/')
      .waitForElementVisible('#app', 1000)
      .assert.count('li a', 3)

      .click('li:nth-child(1) a')
      .assert.urlEquals('http://localhost:8080/nested-router/nested-router')
      .assert.containsText('.child', 'Child router path: /')
      .assert.count('li a', 5)

      .click('.child li:nth-child(1) a')
      .assert.containsText('.child', 'Child router path: /foo')
      .assert.containsText('.child .foo', 'foo')

      .click('.child li:nth-child(2) a')
      .assert.containsText('.child', 'Child router path: /bar')
      .assert.containsText('.child .bar', 'bar')

      .click('li:nth-child(2) a')
      .assert.urlEquals('http://localhost:8080/nested-router/foo')
      .assert.elementNotPresent('.child')
      .assert.containsText('#app', 'foo')
      .assert.count('li a', 3)
      .end()
  }
}
