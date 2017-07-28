
module.exports = {
  'inactive links': function (browser) {
    browser
    .url('http://localhost:8080/inactive-links/')
      .waitForElementVisible('#app', 1000)
      .assert.count('li a', 13)
      // assert correct href with base
      .assert.attributeContains('li:nth-child(1) a', 'href', '/inactive-links/')
      .assert.attributeContains('li:nth-child(2) a', 'href', '/inactive-links/')
      .assert.attributeContains('li:nth-child(3) a', 'href', '/inactive-links/users')
      .assert.attributeContains('li:nth-child(4) a', 'href', '/inactive-links/users')
      .assert.attributeContains('li:nth-child(5) a', 'href', '/inactive-links/users/evan')
      .assert.attributeContains('li:nth-child(6) a', 'href', '/inactive-links/users/evan#foo')
      .assert.attributeContains('li:nth-child(7) a', 'href', '/inactive-links/users/evan?foo=bar')
      .assert.attributeContains('li:nth-child(8) a', 'href', '/inactive-links/users/evan?foo=bar')
      .assert.attributeContains('li:nth-child(9) a', 'href', '/inactive-links/users/evan?foo=bar&baz=qux')
      .assert.attributeContains('li:nth-child(10) a', 'href', '/inactive-links/about')
      .assert.attributeContains('li:nth-child(11) a', 'href', '/inactive-links/about')
      .assert.attributeContains('li:nth-child(12) a', 'href', '/inactive-links/others')
      .assert.attributeContains('li:nth-child(13) a', 'href', '/inactive-links/others')
      .assert.containsText('.view', 'Home')

    assertCustomActiveLinks(12, [12], [13], [12], [13])
    assertCustomInactiveLinks(10, [12], [13], [12], [13])

    browser.end()

    function assertCustomActiveLinks (n, activeA, activeLI, exactActiveA, exactActiveLI) {
      browser.click(`li:nth-child(${n}) a`)
      activeA.forEach(i => {
        browser.assert.cssClassPresent(`li:nth-child(${i}) a`, 'custom-active')
      })
      activeLI && activeLI.forEach(i => {
        browser.assert.cssClassPresent(`li:nth-child(${i})`, 'custom-active')
      })
      exactActiveA.forEach(i => {
        browser.assert.cssClassPresent(`li:nth-child(${i}) a`, 'custom-exact-active')
          .assert.cssClassPresent(`li:nth-child(${i}) a`, 'custom-active')
      })
      exactActiveLI && exactActiveLI.forEach(i => {
        browser.assert.cssClassPresent(`li:nth-child(${i})`, 'custom-exact-active')
          .assert.cssClassPresent(`li:nth-child(${i})`, 'custom-active')
      })
    }
    function assertCustomInactiveLinks (n, activeA, activeLI, exactActiveA, exactActiveLI) {
      browser.click(`li:nth-child(${n}) a`)
      activeA.forEach(i => {
        browser.assert.cssClassPresent(`li:nth-child(${i}) a`, 'custom-inactive')
      })
      activeLI && activeLI.forEach(i => {
        browser.assert.cssClassPresent(`li:nth-child(${i})`, 'custom-inactive')
      })
      exactActiveA.forEach(i => {
        browser.assert.cssClassPresent(`li:nth-child(${i}) a`, 'custom-exact-inactive')
          .assert.cssClassPresent(`li:nth-child(${i}) a`, 'custom-inactive')
      })
      exactActiveLI && exactActiveLI.forEach(i => {
        browser.assert.cssClassPresent(`li:nth-child(${i})`, 'custom-exact-inactive')
          .assert.cssClassPresent(`li:nth-child(${i})`, 'custom-inactive')
      })
    }
  }
}
