const bsStatus = require('../browserstack-send-status')

module.exports = {
  ...bsStatus(),

  '@tags': ['history'],

  'route-props': function (browser) {
    const $attrs = ' { "foo": "123" }'

    browser
      .url('http://localhost:8080/route-props/')
      .waitForElementVisible('#app', 1000)
      .assert.count('li a', 5)

      .assert.urlEquals('http://localhost:8080/route-props/')
      .assert.containsText('.hello', 'Hello Vue!' + $attrs)

      .click('li:nth-child(2) a')
      .assert.urlEquals('http://localhost:8080/route-props/hello/you')
      .assert.containsText('.hello', 'Hello you' + $attrs)

      .click('li:nth-child(3) a')
      .assert.urlEquals('http://localhost:8080/route-props/static')
      .assert.containsText('.hello', 'Hello world' + $attrs)

      .click('li:nth-child(4) a')
      .assert.urlEquals('http://localhost:8080/route-props/dynamic/1')
      .assert.containsText('.hello', 'Hello ' + (new Date().getFullYear() + 1) + '!' + $attrs)

      .click('li:nth-child(5) a')
      .assert.urlEquals('http://localhost:8080/route-props/attrs')
      .assert.containsText('.hello', 'Hello attrs' + $attrs)

      // should be consistent
      .click('li:nth-child(4) a')
      .click('li:nth-child(5) a')
      .assert.urlEquals('http://localhost:8080/route-props/attrs')
      .assert.containsText('.hello', 'Hello attrs' + $attrs)

      .end()
  }
}
