module.exports = {
  'lazy loading': function (browser) {
    browser
    .url('http://localhost:8080/lazy-loading/')
      .waitForElementVisible('#app', 1000)
      .assert.count('li a', 3)
      .assert.containsText('.view', 'home')

      .click('li:nth-child(2) a')
      .assert.containsText('.view', 'This is Foo!')

      .click('li:nth-child(3) a')
      .assert.containsText('.view', 'This is Bar!')

      .click('li:nth-child(1) a')
      .assert.containsText('.view', 'home')

      // test initial visit
    .url('http://localhost:8080/lazy-loading/foo')
      .waitForElementVisible('#app', 1000)
      .assert.containsText('.view', 'This is Foo!')
      .end()
  }
}
