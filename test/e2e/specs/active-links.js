
module.exports = {
  'active links': function (browser) {
    browser
      .url('http://localhost:8080/active-links/')
      .waitForElementVisible('#app', 1000)
      .assert.count('li a', 11)
      // assert correct href with base
      .assert.attributeContains('li:nth-child(1) a', 'href', '/active-links/')
      .assert.attributeContains('li:nth-child(2) a', 'href', '/active-links/')
      .assert.attributeContains('li:nth-child(3) a', 'href', '/active-links/users')
      .assert.attributeContains('li:nth-child(4) a', 'href', '/active-links/users')
      .assert.attributeContains('li:nth-child(5) a', 'href', '/active-links/users/evan')
      .assert.attributeContains('li:nth-child(6) a', 'href', '/active-links/users/evan#foo')
      .assert.attributeContains('li:nth-child(7) a', 'href', '/active-links/users/evan?foo=bar')
      .assert.attributeContains('li:nth-child(8) a', 'href', '/active-links/users/evan?foo=bar')
      .assert.attributeContains('li:nth-child(9) a', 'href', '/active-links/users/evan?foo=bar&baz=qux')
      .assert.attributeContains('li:nth-child(10) a', 'href', '/active-links/about')
      .assert.attributeContains('li:nth-child(11) a', 'href', '/active-links/about')
      .assert.containsText('.view', 'Home')

    assertActiveLinks(1, [1, 2], null, [1, 2])
    assertActiveLinks(2, [1, 2], null, [1, 2])
    assertActiveLinks(3, [1, 3, 4], null, [3, 4])
    assertActiveLinks(4, [1, 3, 4], null, [3, 4])
    assertActiveLinks(5, [1, 3, 5], null, [5])
    assertActiveLinks(6, [1, 3, 5, 6], null, [6])
    assertActiveLinks(7, [1, 3, 5, 7, 8], null, [7, 8])
    assertActiveLinks(8, [1, 3, 5, 7, 8], null, [7, 8])
    assertActiveLinks(9, [1, 3, 5, 7, 9], null, [9])
    assertActiveLinks(10, [1, 10], [11], [10], [11])
    assertActiveLinks(11, [1, 10], [11], [10], [11])

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
