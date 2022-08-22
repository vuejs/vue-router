const bsStatus = require('../browserstack-send-status')

module.exports = {
  ...bsStatus(),

  '@tags': ['history'],

  'useRoute() + useRouter()': function (browser) {
    browser
      .url('http://localhost:8080/composables/')
      .waitForElementVisible('#app', 1000)
      .assert.count('li', 4)
      .assert.count('li a', 4)
      .assert.containsText('.view', 'Home')

      .click('li:nth-child(2) a')
      .assert.containsText('.view', 'About')
      .click('li:nth-child(1) a')
      .assert.containsText('.view', 'Home')
      .assert.containsText('#start-route', '/')
      .assert.containsText('#fullpath', '/')

      .click('button#nav')
      .assert.containsText('#fullpath', '/?n=1')

      .end()
  },

  'useLink()': function (browser) {
    browser
      .url('http://localhost:8080/composables/')
      .waitForElementVisible('#app', 1000)

      .assert.containsText('.view', 'Home')
      .assert.containsText('#nested-active', '/composables/nested: false, false')
      .click('li:nth-child(3) a')
      .assert.containsText('.view', 'NestedEmpty')
      .assert.containsText('#nested-active', '/composables/nested: true, true')
      .click('li:nth-child(4) a')
      .assert.containsText('.view', 'NestedA')
      .assert.containsText('#nested-active', '/composables/nested: true, false')
      .click('#nested-active')
      .assert.containsText('.view', 'NestedEmpty')
      .assert.containsText('#nested-active', '/composables/nested: true, true')

      .end()
  }

}
