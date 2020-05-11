const bsStatus = require('../browserstack-send-status')

module.exports = {
  ...bsStatus(),

  '@tags': ['history'],

  'history state': function (browser) {
    browser
      .url('http://localhost:8080/scroll-behavior/')
      .waitForElementVisible('#app', 1000)

      .execute(function () {
        window.scrollTo(0, 100)
        const key = window.history.state.key
        window.history.replaceState({ key, foo: 'foo' }, '', window.location.pathname)
      })
      .url('http://localhost:8080/scroll-behavior/')
      .waitForElementVisible('#app', 1000)
      .assert.evaluate(function () {
        return window.history.state.foo === 'foo'
      }, null, 'keeps existing state when reloading')

      // check on navigation
      .url('http://localhost:8080/basic/')
      .click('li:nth-child(2) a')
      .assert.urlEquals('http://localhost:8080/basic/foo')
      .execute(function () {
        window.scrollTo(0, 100)
        const key = window.history.state.key
        window.history.replaceState({ key, foo: 'foo' }, '', window.location.pathname)
      })
      .click('li:nth-child(3) a')
      .assert.urlEquals('http://localhost:8080/basic/bar')
      .execute(function () {
        window.history.back()
      })
      .assert.evaluate(function () {
        return window.history.state.foo === 'foo'
      }, null, 'keeps existing state when navigating back')
      .click('li:nth-child(3) a')
      .assert.urlEquals('http://localhost:8080/basic/bar')
      .execute(function () {
        window.scrollTo(0, 100)
        const key = window.history.state.key
        window.history.replaceState({ key, bar: 'bar' }, '', window.location.pathname)
      })
      .click('li:nth-child(9) a')
      .assert.urlEquals('http://localhost:8080/basic/foo')
      .assert.evaluate(function () {
        return window.history.state.bar === 'bar'
      }, null, 'keeps existing state when replacing')

      .end()
  }
}
