module.exports = {
  'lazy loading before mount': function (browser) {
    browser
      .url('http://localhost:8080/lazy-loading-before-mount/')
      // wait for the Foo component to be resolved
      .click('#load-button')
      .waitForElementVisible('.foo', 1000)
      .assert.containsText('.view', 'This is Foo')
      .end()
  }
}
