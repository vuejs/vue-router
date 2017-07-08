module.exports = {
  'async children': function (browser) {
    browser
    .url('http://localhost:8080/async-children/')
      .waitForElementVisible('#app', 1000)
      .assert.count('li a', 8)
      .assert.containsText('.view', 'home')

      .click('li:nth-child(2) a')
      .assert.containsText('.view', 'foo')

      .click('li:nth-child(3) a')
      .assert.containsText('.view', 'bar')

      .click('li:nth-child(1) a')
      .assert.containsText('.view', 'home')

      .click('li:nth-child(4) a')
      .waitForElementVisible('.async-view', 1000)
      .assert.containsText('.async-view', 'basic-default')

    // test linking to children
    .url('http://localhost:8080/async-children')
      .waitForElementVisible('#app', 1000)
      .click('li:nth-child(4) a')
      .waitForElementVisible('.async-view', 1000)
      .assert.containsText('.async-view', 'basic-default')
    
    .url('http://localhost:8080/async-children')
      .waitForElementVisible('#app', 1000)
      .click('li:nth-child(5) a')
      .waitForElementVisible('.async-view', 1000)
      .assert.containsText('.async-view', 'basic-foo')

    .url('http://localhost:8080/async-children')
      .waitForElementVisible('#app', 1000)
      .click('li:nth-child(6) a')
      .waitForElementVisible('.async-view', 1000)
      .assert.containsText('.async-view', 'basic-bar')

    // test deep linking to children
    .url('http://localhost:8080/async-children/basic')
      .waitForElementVisible('.async-view', 1000)
      .assert.containsText('.async-view', 'basic-default')
    
    .url('http://localhost:8080/async-children/basic/foo')
      .waitForElementVisible('.async-view', 1000)
      .assert.containsText('.async-view', 'basic-foo')

    .url('http://localhost:8080/async-children/basic/bar')
      .waitForElementVisible('.async-view', 1000)
      .assert.containsText('.async-view', 'basic-bar')
    
    // test deep async loading
    .url('http://localhost:8080/async-children')
      .waitForElementVisible('#app', 1000)
      .click('li:nth-child(7) a')
      .waitForElementVisible('.async-viewA', 1000)
      .assert.containsText('.async-viewA', 'deep-async-b')

    // test deep default async loading
    .url('http://localhost:8080/async-children')
      .waitForElementVisible('#app', 1000)
      .click('li:nth-child(8) a')
      .waitForElementVisible('.async-viewA', 1000)
      .assert.containsText('.async-viewA', 'deep-async-b')
      
    .end()
  }
}
