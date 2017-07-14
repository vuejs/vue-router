module.exports = {
  'replace routes': function (browser) {
    browser
    .url('http://localhost:8080/replace-routes/')
      .waitForElementVisible('#app', 1000)
      .assert.count('li a', 8)

      // not set is loaded
      .assert.containsText('.route-set', '')
      .assert.containsText('.view', '')

      // load set 1
      .click('.btn1')
      .waitFor(300)
      .assert.urlEquals('http://localhost:8080/replace-routes/')
      .assert.containsText('.route-set', 'set1')
      .assert.containsText('.view', '')

      // load route set1 / route X
      .click('.set1 li:nth-child(1) a')
      .assert.urlEquals('http://localhost:8080/replace-routes/common1')
      .assert.containsText('.route-set', 'set1')
      .assert.containsText('.view', 'Route X')

      // load set2 and check transition to Route Y
      .click('.btn2')
      .waitFor(300)
      .assert.urlEquals('http://localhost:8080/replace-routes/common1')
      .assert.containsText('.route-set', 'set2')
      .assert.containsText('.view', 'Route Y')

      // load route set2 / route Z
      .click('.set2 li:nth-child(2) a')
      .assert.urlEquals('http://localhost:8080/replace-routes/common2')
      .assert.containsText('.route-set', 'set2')
      .assert.containsText('.view', 'Route Z')

      // load set1 and check transition to route Z
      .click('.btn1')
      .waitFor(300)
      .assert.urlEquals('http://localhost:8080/replace-routes/common2')
      .assert.containsText('.route-set', 'set1')
      .assert.containsText('.view', 'Route Z')

      // load set1 / route 1
      .click('.set1 li:nth-child(3) a')
      .assert.urlEquals('http://localhost:8080/replace-routes/route-1')
      .assert.containsText('.route-set', 'set1')
      .assert.containsText('.view', 'Route 1')

      // load set2 and check that no route matched
      .click('.btn2')
      .waitFor(300)
      .assert.urlEquals('http://localhost:8080/replace-routes/route-1')
      .assert.containsText('.route-set', 'set2')
      .assert.containsText('.view', '')

      // load set2 / route 3
      .click('.set2 li:nth-child(3) a')
      .assert.urlEquals('http://localhost:8080/replace-routes/route-3')
      .assert.containsText('.route-set', 'set2')
      .assert.containsText('.view', 'Route 3')

      // load set1 and route 2
      .click('.btn1')
      .waitFor(300)
      .click('.set1 li:nth-child(4) a')
      .assert.urlEquals('http://localhost:8080/replace-routes/route-2')
      .assert.containsText('.route-set', 'set1')
      .assert.containsText('.view', 'Route 2')

      // load set2 and route 4
      .click('.btn2')
      .waitFor(300)
      .click('.set2 li:nth-child(4) a')
      .assert.urlEquals('http://localhost:8080/replace-routes/route-4')
      .assert.containsText('.route-set', 'set2')
      .assert.containsText('.view', 'Route 4')

      // remove all routes
      .click('.btn3')
      .waitFor(300)
      .assert.urlEquals('http://localhost:8080/replace-routes/route-4')
      .assert.containsText('.route-set', '')
      .assert.containsText('.view', '')

      // load set1 / route X and check that no route matched
      .click('.set1 li:nth-child(1) a')
      .assert.urlEquals('http://localhost:8080/replace-routes/common1')
      .assert.containsText('.route-set', '')
      .assert.containsText('.view', '')

      .end()
  }
}
