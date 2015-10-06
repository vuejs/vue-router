/* global router */

var base = 'http://localhost:' + (process.env.PORT || 8080)

module.exports = {
  'vue-router e2e tests': function (browser) {
    browser
    // default 404
    .url(base)
      .waitForElementVisible('h1', 1000)
      .assert.containsText('.view', 'FOUR OH FOUR')

    // /about
    .url(base + '/about')
      .waitForElementVisible('h1', 1000)
      .assert.containsText('.view h2', 'ABOUT US')
      .assert.cssClassPresent('a[href="/about"]', 'v-link-active')
      // should not be able to navigate to inbox
      .click('a[href^="/inbox"]')
      .pause(100)
      .getAlertText(function (text) {
        this.assert.ok(/navigate/.test(text.value))
      })
      .acceptAlert()
      // should not have changed
      .assert.containsText('.view h2', 'ABOUT US')
      .assert.cssClassPresent('a[href="/about"]', 'v-link-active')

    // /user
    .url(base + '/user/1234/profile/what')
      .waitForElementVisible('h1', 1000)
      .assert.containsText('.view h2', 'User yo')
      .assert.containsText('.view h3', 'user profile')
      .assert.containsText('.view p', '1234 what')
      .assert.cssClassPresent('a[href^="/user"]', 'v-link-active')
      // change params
      .execute(function () {
        router.go('/user/2345/profile/hey')
      })
      .assert.containsText('.view p', '2345 hey')
      // other routes
      .execute(function () {
        router.go('/user/2345/posts')
      })
      .assert.containsText('.view h3', 'user posts')
      .execute(function () {
        router.go('settings')
      })
      .assert.containsText('.view div', 'user settings')

    // inbox
    .url(base + '/inbox')
      .waitForElementVisible('h1', 1000)
      .assert.containsText('.view h2', 'inbox!')
      .assert.containsText('.view', 'default yo')

    .url(base + '/inbox/message/123')
      .waitForElementVisible('h1', 1000)
      .assert.containsText('.view div', 'Loading data')
      .assert.containsText('.view h2', 'inbox!')
      .pause(3000)
      .assert.containsText('.view div', 'message #123: Hello this is a message')
      // confirm navigation
      .click('a[href^="/user"]')
      .pause(100)
      .getAlertText(function (text) {
        this.assert.ok(/Are you sure/.test(text.value))
      })
      // cancel navigation
      .dismissAlert()
      // wait for possible transition
      .pause(1000)
      .assert.containsText('.view div', 'message #123: Hello this is a message')
      // then do it again
      .click('a[href^="/about"]')
      .pause(100)
      .acceptAlert()
      .pause(1000)
      .assert.containsText('.view h2', 'ABOUT US')

    // forbidden
    .url(base + '/forbidden')
      .waitForElementVisible('#app > p', 1000)
      .assert.containsText('#app > p', 'Authenticating')
      .pause(3000)
      .getAlertText(function (text) {
        this.assert.ok(/forbidden by a global before hook/.test(text.value))
      })
      .acceptAlert()
      .assert.hidden('#app > p')

    // redirect
    .url(base + '/info')
      .waitForElementVisible('h1', 1000)
      .assert.containsText('.view h2', 'ABOUT US')
      .assert.cssClassPresent('a[href="/about"]', 'v-link-active')
      .end()
  }
}
