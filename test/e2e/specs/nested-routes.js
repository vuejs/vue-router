module.exports = {
  'nested routes': function (browser) {
    browser
    .url('http://localhost:8080/nested-routes/')
      .waitForElementVisible('#app', 1000)
      .assert.count('li a', 9)
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

      .click('li:nth-child(5) a')
      .assert.urlEquals('http://localhost:8080/nested-routes/parent/qux/123')
      .assert.containsText('.view', 'Parent')
      .assert.containsText('.view', 'qux')

      .click('.nested-parent a')
      .assert.urlEquals('http://localhost:8080/nested-routes/parent/qux/123/quux')
      .assert.containsText('.view', 'Parent')
      .assert.containsText('.view', 'qux')
      .assert.containsText('.view', 'quux')

      .click('li:nth-child(6) a')
      .assert.urlEquals('http://localhost:8080/nested-routes/parent/quy/123')
      .assert.containsText('.view', 'Parent')
      .assert.containsText('.view', 'quy')
      .assert.evaluate(function () {
        var params = JSON.parse(document.querySelector('pre').textContent)
        return (
          JSON.stringify(params) === JSON.stringify(['quyId'])
        )
      }, null, 'quyId')

      .click('li:nth-child(8) a')
      .assert.urlEquals('http://localhost:8080/nested-routes/parent/zap/1')
      .assert.containsText('.view', 'Parent')
      .assert.containsText('.view', 'zap')
      .assert.evaluate(function () {
        var zapId = document.querySelector('pre').textContent
        return (zapId === '1')
      }, null, 'zapId')

      .click('li:nth-child(7) a')
      .assert.urlEquals('http://localhost:8080/nested-routes/parent/zap')
      .assert.containsText('.view', 'Parent')
      .assert.containsText('.view', 'zap')
      .assert.evaluate(function () {
        var zapId = document.querySelector('pre').textContent
        return (zapId === '')
      }, null, 'optional zapId')

      // test relative params
      .click('li:nth-child(9) a')
      .assert.evaluate(function () {
        var zapId = document.querySelector('pre').textContent
        return (zapId === '2')
      }, null, 'relative params')

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
