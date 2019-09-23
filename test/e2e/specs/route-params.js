const bsStatus = require('../browserstack-send-status')

module.exports = {
  ...bsStatus(),

  '@tags': ['history'],

  'route-params': function (browser) {
    browser
      .url('http://localhost:8080/route-params/')
      .waitForElementVisible('#app', 1000)
      .assert.count('li a', 2)

      // https://github.com/vuejs/vue-router/issues/2800
      .click('li:nth-child(1) a')
      .assert.urlEquals('http://localhost:8080/route-params/items/1/logs')
      .assert.containsText('#params', JSON.stringify({ type: 'info' }, null, 2))
      .click('.child-link')
      .assert.urlEquals('http://localhost:8080/route-params/items/1/logs/info')
      .assert.containsText('.log', 'id: 1, type: info')
      // https://github.com/vuejs/vue-router/issues/2938
      .assert.containsText('#params', JSON.stringify({ type: 'info' }, null, 2))

      .click('li:nth-child(2) a')
      .assert.urlEquals('http://localhost:8080/route-params/items/2/logs')
      .click('.child-link')
      .assert.urlEquals('http://localhost:8080/route-params/items/2/logs/info')
      .assert.containsText('.log', 'id: 2, type: info')

      .end()
  }
}
