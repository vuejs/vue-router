module.exports = {
  'placeholder': function (browser) {
    browser
      .url('http://localhost:8080/placeholder/')
      .waitForElementVisible('#app', 1000)

      // Assert that 2 elements exist
      // because the last one doesn't have a placeholder
      .assert.count('#app div.placeholder', 2)
      .assert.containsText('#header-loading', 'Loading header...')
      .assert.containsText('#default-loading', 'Loading default...')

      // When the timeout ends, assert if the components are there
      .waitForElementVisible('#home', 1000)
      .assert.count('#app div.placeholder', 0)
      .assert.containsText('#header', 'This is Header')
      .assert.containsText('#home', 'This is Home')
      .assert.containsText('#footer', 'This is Footer')

      .end()
  }
}
