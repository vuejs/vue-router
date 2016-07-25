module.exports = {
  'active links': function (browser) {
    browser
    .url('http://localhost:8080/active-links/')
      .waitForElementVisible('#app', 1000)
      .assert.count('li a', 9)
      // assert correct href with base
      .assert.attributeContains('li:nth-child(1) a', 'href', '/active-links/')
      .assert.attributeContains('li:nth-child(2) a', 'href', '/active-links/')
      .assert.attributeContains('li:nth-child(3) a', 'href', '/active-links/users')
      .assert.attributeContains('li:nth-child(4) a', 'href', '/active-links/users')
      .assert.attributeContains('li:nth-child(5) a', 'href', '/active-links/users/evan')
      .assert.attributeContains('li:nth-child(6) a', 'href', '/active-links/users/evan#foo')
      .assert.attributeContains('li:nth-child(7) a', 'href', '/active-links/users/evan?foo=bar')
      .assert.attributeContains('li:nth-child(8) a', 'href', '/active-links/users/evan?baz=qux&foo=bar')
      .assert.attributeContains('li:nth-child(9) a', 'href', '/active-links/about')
      .assert.containsText('.view', 'Home')

    assertActiveLinks(1, [1, 2])
    assertActiveLinks(2, [1, 2])
    assertActiveLinks(3, [1, 3, 4])
    assertActiveLinks(4, [1, 3, 4])
    assertActiveLinks(5, [1, 3, 5])
    assertActiveLinks(6, [1, 3, 5, 6])
    assertActiveLinks(7, [1, 3, 5, 7])
    assertActiveLinks(8, [1, 3, 5, 7, 8])
    assertActiveLinks(9, [1, 9])

    browser.end()

    function assertActiveLinks (n, activeOnes) {
      browser.click(`li:nth-child(${n}) a`)
      activeOnes.forEach(i => {
        browser.assert.cssClassPresent(`li:nth-child(${i}) a`, 'router-link-active')
      })
    }
  }
}
