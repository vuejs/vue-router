const bsStatus = require('../browserstack-send-status')

module.exports = {
  ...bsStatus(),

  '@tags': [],

  'route-matching': function (browser) {
    browser
      .url('http://localhost:8080/route-matching/')
      .waitForElementVisible('#app', 1000)
      .assert.count('li a', 12)
      .assert.evaluate(
        function () {
          var route = JSON.parse(document.querySelector('pre').textContent)
          return (
            route.matched.length === 1 &&
            route.matched[0].path === '' &&
            route.fullPath === '/' &&
            JSON.stringify(route.params) === JSON.stringify({})
          )
        },
        null,
        '/'
      )

      .click('li:nth-child(2) a')
      .assert.evaluate(
        function () {
          var route = JSON.parse(document.querySelector('pre').textContent)
          return (
            route.matched.length === 1 &&
            route.matched[0].path === '/params/:foo/:bar' &&
            route.fullPath === '/params/foo/bar' &&
            JSON.stringify(route.params) ===
              JSON.stringify({
                foo: 'foo',
                bar: 'bar'
              })
          )
        },
        null,
        '/params/foo/bar'
      )

      .click('li:nth-child(3) a')
      .assert.evaluate(
        function () {
          var route = JSON.parse(document.querySelector('pre').textContent)
          return (
            route.matched.length === 1 &&
            route.matched[0].path === '/optional-params/:foo?' &&
            route.fullPath === '/optional-params' &&
            JSON.stringify(route.params) === JSON.stringify({})
          )
        },
        null,
        '/optional-params'
      )

      .click('li:nth-child(4) a')
      .assert.evaluate(
        function () {
          var route = JSON.parse(document.querySelector('pre').textContent)
          return (
            route.matched.length === 1 &&
            route.matched[0].path === '/optional-params/:foo?' &&
            route.fullPath === '/optional-params/foo' &&
            JSON.stringify(route.params) ===
              JSON.stringify({
                foo: 'foo'
              })
          )
        },
        null,
        '/optional-params/foo'
      )

      .click('li:nth-child(5) a')
      .assert.evaluate(
        function () {
          var route = JSON.parse(document.querySelector('pre').textContent)
          return (
            route.matched.length === 1 &&
            route.matched[0].path === '/params-with-regex/:id(\\d+)' &&
            route.fullPath === '/params-with-regex/123' &&
            JSON.stringify(route.params) ===
              JSON.stringify({
                id: '123'
              })
          )
        },
        null,
        '/params-with-regex/123'
      )

      .click('li:nth-child(6) a')
      .assert.evaluate(
        function () {
          var route = JSON.parse(document.querySelector('pre').textContent)
          return (
            route.matched.length === 0 &&
            route.fullPath === '/params-with-regex/abc' &&
            JSON.stringify(route.params) === JSON.stringify({})
          )
        },
        null,
        '/params-with-regex/abc'
      )

      .click('li:nth-child(7) a')
      .assert.evaluate(
        function () {
          var route = JSON.parse(document.querySelector('pre').textContent)
          return (
            route.matched.length === 1 &&
            route.matched[0].path === '/asterisk/*' &&
            route.fullPath === '/asterisk/foo' &&
            JSON.stringify(route.params) ===
              JSON.stringify({
                pathMatch: 'foo'
              })
          )
        },
        null,
        '/asterisk/foo'
      )

      .click('li:nth-child(8) a')
      .assert.evaluate(
        function () {
          var route = JSON.parse(document.querySelector('pre').textContent)
          return (
            route.matched.length === 1 &&
            route.matched[0].path === '/asterisk/*' &&
            route.fullPath === '/asterisk/foo/bar' &&
            JSON.stringify(route.params) ===
              JSON.stringify({
                pathMatch: 'foo/bar'
              })
          )
        },
        null,
        '/asterisk/foo/bar'
      )

      .click('li:nth-child(9) a')
      .assert.evaluate(
        function () {
          var route = JSON.parse(document.querySelector('pre').textContent)
          return (
            route.matched.length === 1 &&
            route.matched[0].path === '/optional-group/(foo/)?bar' &&
            route.fullPath === '/optional-group/bar' &&
            JSON.stringify(route.params) === JSON.stringify({})
          )
        },
        null,
        '/optional-group/bar'
      )

      .click('li:nth-child(10) a')
      .assert.evaluate(
        function () {
          var route = JSON.parse(document.querySelector('pre').textContent)
          return (
            route.matched.length === 1 &&
            route.matched[0].path === '/optional-group/(foo/)?bar' &&
            route.fullPath === '/optional-group/foo/bar' &&
            JSON.stringify(route.params) ===
              JSON.stringify({
                pathMatch: 'foo/'
              })
          )
        },
        null,
        '/optional-group/foo/bar'
      )

      .click('li:nth-child(11) a')
      .assert.evaluate(
        function () {
          var route = JSON.parse(document.querySelector('pre').textContent)
          return (
            route.matched.length === 1 &&
            route.matched[0].path === '/special/:word' &&
            route.fullPath === encodeURI('/special/tést1') &&
            JSON.stringify(route.params) ===
            JSON.stringify({
              word: 'tést1'
            })
          )
        },
        null,
        '/optional-group/special/tést1'
      )

      .click('li:nth-child(12) a')
      .assert.evaluate(
        function () {
          var route = JSON.parse(document.querySelector('pre').textContent)
          return (
            route.matched.length === 1 &&
            route.matched[0].path === '/special/:word' &&
            route.fullPath === encodeURI('/special/tést2') &&
            JSON.stringify(route.params) ===
            JSON.stringify({
              word: 'tést2'
            })
          )
        },
        null,
        '/optional-group/special/tést2'
      )

      .url('http://localhost:8080/route-matching/special/tést1')
      .waitForElementVisible('#app', 1000)
      .assert.evaluate(
        function () {
          return document.querySelector('li:nth-child(11) a').classList.contains('router-link-active')
        },
        null,
        '/optional-group/special/tést1 init active router'
      )

      .url('http://localhost:8080/route-matching/special/tést2')
      .waitForElementVisible('#app', 1000)
      .assert.evaluate(
        function () {
          return document.querySelector('li:nth-child(12) a').classList.contains('router-link-active')
        },
        null,
        '/optional-group/special/tést2 init active router'
      )
      .end()
  }
}
