module.exports = {
  'basic': function (browser) {
    browser
    .url('http://localhost:8080/external-routes/')
      .waitForElementVisible('#app', 1000)
      .assert.count('li a', 6)
      .assert.attributeContains('li:nth-child(1) a', 'href', 'example.com')
      .assert.attributeContains('li:nth-child(1) a', 'target', '_blank')
      .assert.attributeContains('li:nth-child(2) a', 'href', 'example.com')
      .assert.attributeContains('li:nth-child(2) a', 'target', '_blank')
      .assert.attributeContains('li:nth-child(3) a', 'href', 'https://example.com/user/evan')
      .assert.attributeContains('li:nth-child(3) a', 'target', '_blank')
      .assert.attributeContains('li:nth-child(4) a', 'href', 'https://example.com/user/evan/settings')
      .assert.attributeContains('li:nth-child(4) a', 'target', '_blank')
      .assert.attributeContains('li:nth-child(5) a', 'href', 'https://example.com/?foo=bar')
      .assert.attributeContains('li:nth-child(5) a', 'target', '_blank')
      .assert.attributeContains('li:nth-child(6) a', 'href', 'https://example.com/#foo')
      .assert.attributeContains('li:nth-child(6) a', 'target', '_blank')
      .end()
  }
}
