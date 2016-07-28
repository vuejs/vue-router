module.exports = {
  'data fetching': function (browser) {
    browser
    .url('http://localhost:8080/data-fetching/')
      .waitForElementVisible('#app', 1000)
      .assert.count('li a', 4)
      .assert.containsText('.view', 'home')

      .click('li:nth-child(2) a')
      .waitForElementNotPresent('.loading', 500)
      .assert.containsText('.post h2', 'sunt aut facere')
      .assert.containsText('.post p', 'quia et suscipit')

      .click('li:nth-child(3) a')
      .waitForElementNotPresent('.loading', 500)
      .assert.containsText('.post h2', 'qui est esse')
      .assert.containsText('.post p', 'est rerum tempore')

      .click('li:nth-child(4) a')
      .waitForElementNotPresent('.loading', 500)
      .assert.elementNotPresent('.content')
      .assert.containsText('.error', 'Post not found')

      .click('li:nth-child(1) a')
      .assert.elementNotPresent('.post')
      .assert.containsText('.view', 'home')
      .end()
  }
}
