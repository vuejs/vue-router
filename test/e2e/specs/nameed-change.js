module.exports = {
  'nameed change': function (browser) {
    browser
    .url('http://localhost:8080/nameed-change/')
      .waitForElementVisible('#app', 1000)

      .assert.urlEquals('http://localhost:8080/nameed-change/0')
      .assert.containsText('.count', '0')
      .assert.attributeContains('.area a:nth-child(1)', 'href', '/nameed-change/0')
      .assert.attributeContains('.area a:nth-child(1)', 'href', '/nameed-change/0')
      .click('button')
      .assert.containsText('.count', '1')
      .assert.attributeContains('.area a:nth-child(1)', 'href', '/nameed-change/1')
      .assert.attributeContains('.area a:nth-child(1)', 'href', '/nameed-change/1')
    .end()
  }
}
