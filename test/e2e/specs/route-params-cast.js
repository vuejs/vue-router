module.exports = {
  'route-params-cast': function (browser) {
    browser
    .url('http://localhost:8080/route-params-cast/')
      .waitForElementVisible('#app', 1000)
      .assert.count('li a', 4)

      .click('li:nth-child(1) a')
      .assert.urlEquals('http://localhost:8080/route-params-cast/')
      .assert.containsText('.hello', 'Hello Vue!')
      .assert.containsText('.type', 'string')

      .click('li:nth-child(2) a')
      .assert.urlEquals('http://localhost:8080/route-params-cast/hello/you')
      .assert.containsText('.hello', 'Hello you')
      .assert.containsText('.type', 'string')

      .click('li:nth-child(3) a')
      .assert.urlEquals('http://localhost:8080/route-params-cast/number/3')
      .assert.containsText('.hello', 'Hello 3')
      .assert.containsText('.type', 'number')

      .click('li:nth-child(4) a')
      .assert.urlEquals('http://localhost:8080/route-params-cast/exclamation/1')
      .assert.containsText('.hello', 'Hello 1!')
      .assert.containsText('.type', 'string')

      .end()
  }
}
