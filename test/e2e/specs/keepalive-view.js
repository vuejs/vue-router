module.exports = {
  'keepalive view': function (browser) {
    browser
      .url('http://localhost:8080/keepalive-view/')
      .waitForElementVisible('#app', 1000)
      .assert.count('li a', 5)

      .click('li:nth-child(1) a')
      .assert.containsText('.view', 'index child1')

      .click('li:nth-child(2) a')
      .assert.containsText('.view', 'index child2')

      .click('li:nth-child(3) a')
      .assert.containsText('.view', 'home')

      // back to index child1 and check it
      .click('li:nth-child(1) a')
      .assert.containsText('.view', 'index child1')

      // beforeRouteEnter guard with keep alive
      // https://github.com/vuejs/vue-router/issues/2561
      .click('li:nth-child(4) a')
      .assert.containsText('.view', 'with-guard1: 1')
      .click('li:nth-child(3) a')
      .assert.containsText('.view', 'home')
      .click('li:nth-child(5) a')
      .assert.containsText('.view', 'with-guard2: 2')
      .click('li:nth-child(4) a')
      .assert.containsText('.view', 'with-guard1: 3')

      .end()
  }
}
