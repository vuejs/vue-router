const bsStatus = require('../browserstack-send-status')

module.exports = {
  ...bsStatus(),

  '@tags': ['history'],

  'useRoute() + useRouter()': function (browser) {
    browser
      .url('http://localhost:8080/composables/')
      .waitForElementVisible('#app', 1000)
      .assert.count('li', 2)
      .assert.count('li a', 2)
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
  }

}
