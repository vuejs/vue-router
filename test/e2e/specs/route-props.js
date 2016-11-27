module.exports = {
  'route-props': function (browser) {
    browser
    .url('http://localhost:8080/route-props/')
      .waitForElementVisible('#app', 1000)
      .assert.count('li a', 5)

      .assert.urlEquals('http://localhost:8080/route-props/')
      .assert.containsText('.hello', 'Hello Vue!')

      .click('li:nth-child(2) a')
      .assert.urlEquals('http://localhost:8080/route-props/hello/you')
      .assert.containsText('.hello', 'Hello you')

      .click('li:nth-child(3) a')
      .assert.urlEquals('http://localhost:8080/route-props/static')
      .assert.containsText('.hello', 'Hello world')

      .click('li:nth-child(4) a')
      .assert.urlEquals('http://localhost:8080/route-props/dynamic/1')
      .assert.containsText('.hello', 'Hello ' + ((new Date()).getFullYear() + 1)+ '!')

      .click('li:nth-child(5) a')
      .assert.urlEquals('http://localhost:8080/route-props/calculator/2/3')
      .assert.containsText('.calculator_add', '2 + 3 = 5')
      .assert.containsText('.calculator_multiply', '2 * 3 = 6')
      .end()
  }
}
