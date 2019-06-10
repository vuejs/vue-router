const bsStatus = require('../browserstack-send-status')

module.exports = {
  ...bsStatus(),

  '@tags': ['history'],

  transitions: function (browser) {
    const TIMEOUT = 2000

    browser
      .url('http://localhost:8080/transitions/')
      .waitForElementVisible('#app', 1000)
      .assert.count('li a', 4)

      .click('li:nth-child(2) a')
      .assert.cssClassPresent('.view.home', 'fade-leave-active')
      .waitForElementPresent('.view.parent', TIMEOUT)
      .assert.cssClassPresent('.view.parent', 'fade-enter-active')
      .assert.cssClassNotPresent('.child-view.default', 'slide-left-enter-active')
      .waitForElementNotPresent('.view.parent.fade-enter-active', TIMEOUT)

      .click('li:nth-child(3) a')
      .assert.cssClassPresent('.child-view.default', 'slide-left-leave-active')
      .assert.cssClassPresent('.child-view.foo', 'slide-left-enter-active')
      .waitForElementNotPresent('.child-view.default', TIMEOUT)

      .click('li:nth-child(4) a')
      .assert.cssClassPresent('.child-view.foo', 'slide-left-leave-active')
      .assert.cssClassPresent('.child-view.bar', 'slide-left-enter-active')
      .waitForElementNotPresent('.child-view.foo', TIMEOUT)

      .click('li:nth-child(2) a')
      .assert.cssClassPresent('.child-view.bar', 'slide-right-leave-active')
      .assert.cssClassPresent('.child-view.default', 'slide-right-enter-active')
      .waitForElementNotPresent('.child-view.bar', TIMEOUT)

      .click('li:nth-child(1) a')
      .assert.cssClassPresent('.view.parent', 'fade-leave-active')
      .waitForElementPresent('.view.home', TIMEOUT)
      .assert.cssClassPresent('.view.home', 'fade-enter-active')
      .waitForElementNotPresent('.view.home.fade-enter-active', TIMEOUT)

      .end()
  }
}
