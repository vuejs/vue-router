module.exports = {
  'Basic test': function (browser) {
    browser
      .url('http://localhost:8080/about')
      .waitForElementVisible('.view h2', 1000)
      .assert.containsText('.view h2', 'ABOUT US')
      .assert.cssClassPresent('a[href="/about"]', 'v-link-active')
      .assert.cssClassPresent('a[href="/about"]', 'v-link-active-exact')
      .end()
  }
}
