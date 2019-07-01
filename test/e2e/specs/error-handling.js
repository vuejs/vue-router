const bsStatus = require('../browserstack-send-status')

const PAGE_NAME = 'error-handling'
const BASE_PAGE = `http://localhost:8080/${PAGE_NAME}`

module.exports = {
  ...bsStatus(),

  '@tags': ['history'],

  [BASE_PAGE]: function (browser) {
    browser
      .url(BASE_PAGE + '/')
      .waitForElementVisible('#app', 1000)
      .assert.count('li a', 6)
      // assert correct href with base
      .assert.attributeContains('li:nth-child(1) a', 'href', `/${PAGE_NAME}/`)
      .assert.attributeContains('li:nth-child(2) a', 'href', `/${PAGE_NAME}/before-each`)
      .assert.attributeContains('li:nth-child(3) a', 'href', `/${PAGE_NAME}/after-each`)
      .assert.attributeContains('li:nth-child(4) a', 'href', `/${PAGE_NAME}/before-enter`)
      .assert.attributeContains('li:nth-child(5) a', 'href', `/${PAGE_NAME}/before-update/1`)
      .assert.attributeContains('li:nth-child(6) a', 'href', `/${PAGE_NAME}/before-leave`)
      .assert.attributeContains('strong', 'mode', 'async')
      .assert.containsText('.log code', 'async: router.afterEach')
      .assert.containsText('.view', 'Home')

      // Error on enter (global)
      .click('li:nth-child(2) a')
      .assert.urlEquals(`${BASE_PAGE}/`)
      .assert.containsText('.log code', 'async: router.beforeEach')
      .assert.containsText('.view', 'Home')

      // Error on leave (global)
      .click('li:nth-child(3) a')
      .assert.urlEquals(`${BASE_PAGE}/after-each`)
      .assert.containsText('.log code', 'async: router.afterEach')
      .assert.containsText('.view', 'AfterEach')

      // Error on enter (component)
      .click('li:nth-child(4) a')
      .assert.urlEquals(`${BASE_PAGE}/after-each`)
      .assert.containsText('.log code', 'async: component.BeforeRouteEnter')
      .assert.containsText('.view', 'AfterEach')

      // Error on change route (component)
      // mounted change route.id to 2
      .click('li:nth-child(5) a')
      .assert.urlEquals(`${BASE_PAGE}/before-update/1`)
      .assert.containsText('.log code', 'async: component.BeforeRouteUpdate')
      .assert.containsText('.view', 'BeforeRouteUpdate')

      // Error on leave route (component)
      .click('li:nth-child(6) a')
      .assert.urlEquals(`${BASE_PAGE}/before-leave`)
      .assert.containsText('.log code', 'async: router.afterEach')
      .assert.containsText('.view', 'BeforeRouteLeave')

      // Click twice to leave the route
      .click('li:nth-child(1) a')
      .assert.urlEquals(`${BASE_PAGE}/before-leave`)
      .assert.containsText('.log code', 'async: component.beforeRouteLeave')
      .assert.containsText('.view', 'BeforeRouteLeave')

      .click('li:nth-child(1) a')
      .assert.urlEquals(`${BASE_PAGE}/`)
      .assert.containsText('.log code', 'async: router.afterEach')
      .assert.containsText('.view', 'Home')

      .end()
  }
}
