module.exports = {
  'keepalive view': function (browser) {
    browser
      .url('http://localhost:8080/keepalive-view/')
      .waitForElementVisible('#app', 1000)
      .assert.count('li a', 3)

      .click('li:nth-child(1) a')
      .assert.containsText('.current', 'index child1')

      .click('li:nth-child(2) a')
      .assert.containsText('.current', 'index child2')

      .click('li:nth-child(3) a')
      .assert.containsText('.current', 'home')

      // back to index child1 and check it
      .click('li:nth-child(1) a')
      .assert.containsText('.current', 'index child1')
      .end()
  }
}
