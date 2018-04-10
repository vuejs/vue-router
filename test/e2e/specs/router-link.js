// This test should be done in a unit test once we migrate to jest

module.exports = {
  'router link': function (browser) {
    browser
    .url('http://localhost:8080/router-link/')
      .waitForElementVisible('#app', 1000)
      // assert correct href with base
      .assert.cssClassPresent('li:nth-child(1) a', 'custom-class')
      .assert.cssClassPresent('li:nth-child(1) a', 'otherClass')
      .assert.cssClassPresent('li:nth-child(1) a', 'router-link-active')

      .assert.containsText('li:nth-child(2) button', 'N CustomLink')

      .assert.attributeContains('li:nth-child(3) a', 'style', 'color:')
      .assert.attributeContains('li:nth-child(3) a', 'style', 'font-size: 8px')

      .click('li:nth-child(5) a')
      .assert.attributeContains('li:nth-child(7) a', 'href', '/router-link/sub/1/nested1')
      .assert.attributeContains('li:nth-child(8) a', 'href', '/router-link/sub/1/nested2')
      .click('li:nth-child(6) a')
      .assert.attributeContains('li:nth-child(7) a', 'href', '/router-link/sub/2/nested1')
      .assert.attributeContains('li:nth-child(8) a', 'href', '/router-link/sub/2/nested2')

      browser.expect.element('li:nth-child(2) button').to.have.attribute('disabled')

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
