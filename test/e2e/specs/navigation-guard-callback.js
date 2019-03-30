module.exports = {
  'navigation guard callback': function (browser) {
    browser
      .url('http://localhost:8080/navigation-guard-callback/')
      .waitForElementVisible('#app', 1000)
      .assert.count('li a', 4)

      .click('.btn-clear-log')
      .assert.containsText('.log', '')
      .click('#foo1')
      .assert.containsText('.current', 'foo')
      .assert.containsText('.log', 'beforeRouteEnter callback emited')

      .click('#bar')
      .assert.containsText('.current', 'bar')

      .click('.btn-clear-log')
      .assert.containsText('.log', '')
      .click('#foo2')
      .assert.containsText('.current', 'foo')
      .assert.containsText('.log', 'beforeRouteEnter callback emited')

      // back to root path
      .click('#root')
      .assert.urlEquals('http://localhost:8080/navigation-guard-callback/')

      // apply keep-alive
      .click('.btn-apply-keep-alive')
      .assert.elementPresent('.keep-alive-wrap')

      // do the same
      .click('.btn-clear-log')
      .assert.containsText('.log', '')
      .click('#foo1')
      .assert.containsText('.current', 'foo')
      .assert.containsText('.log', 'beforeRouteEnter callback emited')

      .click('#bar')
      .assert.containsText('.current', 'bar')

      .click('.btn-clear-log')
      .assert.containsText('.log', '')
      .click('#foo2')
      .assert.containsText('.current', 'foo')
      .assert.containsText('.log', 'beforeRouteEnter callback emited')
      .end()
  }
}
