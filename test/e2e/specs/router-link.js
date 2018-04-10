// This test should be done in a unit test once we migrate to jest

module.exports = {
  'router link': function (browser) {
    browser
    .url('http://localhost:8080/router-link/')
      .waitForElementVisible('#app', 1000)
      // assert correct href with base
      .assert.cssClassPresent('li:nth-child(1) a', 'custom-class')
      .assert.containsText('.view', 'Home')

    browser.end()

    function assertActiveLinks (n, activeA, activeLI, exactActiveA, exactActiveLI) {
      browser.click(`li:nth-child(${n}) a`)
      activeA.forEach(i => {
        browser.assert.cssClassPresent(`li:nth-child(${i}) a`, 'router-link-active')
      })
      activeLI && activeLI.forEach(i => {
        browser.assert.cssClassPresent(`li:nth-child(${i})`, 'router-link-active')
      })
      exactActiveA.forEach(i => {
        browser.assert.cssClassPresent(`li:nth-child(${i}) a`, 'router-link-exact-active')
          .assert.cssClassPresent(`li:nth-child(${i}) a`, 'router-link-active')
      })
      exactActiveLI && exactActiveLI.forEach(i => {
        browser.assert.cssClassPresent(`li:nth-child(${i})`, 'router-link-exact-active')
          .assert.cssClassPresent(`li:nth-child(${i})`, 'router-link-active')
      })
    }
  }
}
