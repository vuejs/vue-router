const bsStatus = require('../browserstack-send-status')

module.exports = {
  ...bsStatus(),

  '@tags': ['history'],

  'navigation guards with alerts': function (browser) {
    browser
      .url('http://localhost:8080/navigation-guards/')
      .waitForElementVisible('#app', 1000)
      .assert.count('li a', 9)
      .assert.containsText('.view', 'home')

    // alert commands not available in phantom
    if (process.env.PHANTOMJS) return

    browser
      .click('li:nth-child(2) a')
      .dismissAlert()
      .waitFor(100)
      .dismissAlert()
      .assert.urlEquals('http://localhost:8080/navigation-guards/')
      .assert.containsText('.view', 'home')

      .click('li:nth-child(2) a')
      .acceptAlert()
      .assert.urlEquals('http://localhost:8080/navigation-guards/foo')
      .assert.containsText('.view', 'foo')

      .click('li:nth-child(3) a')
      .dismissAlert()
      .waitFor(100)
      .dismissAlert()
      .assert.urlEquals('http://localhost:8080/navigation-guards/foo')
      .assert.containsText('.view', 'foo')

      .click('li:nth-child(3) a')
      .acceptAlert()
      .assert.urlEquals('http://localhost:8080/navigation-guards/bar')
      .assert.containsText('.view', 'bar')

      .click('li:nth-child(2) a')
      .dismissAlert()
      .waitFor(100)
      .acceptAlert() // redirect to baz
      .assert.urlEquals('http://localhost:8080/navigation-guards/baz')
      .assert.containsText('.view', 'baz (not saved)')

      .click('li:nth-child(2) a')
      .dismissAlert() // not saved
      .assert.urlEquals('http://localhost:8080/navigation-guards/baz')
      .assert.containsText('.view', 'baz (not saved)')

      .click('li:nth-child(2) a')
      .acceptAlert() // not saved, force leave
      .waitFor(100)
      .dismissAlert() // should trigger foo's guard
      .waitFor(100)
      .dismissAlert()
      .assert.urlEquals('http://localhost:8080/navigation-guards/baz')
      .assert.containsText('.view', 'baz')

      .click('li:nth-child(2) a')
      .acceptAlert()
      .waitFor(100)
      .acceptAlert()
      .assert.urlEquals('http://localhost:8080/navigation-guards/foo')
      .assert.containsText('.view', 'foo')

    // test initial visit
    browser
      .url('http://localhost:8080/navigation-guards/foo')
      .dismissAlert()
      .waitFor(100)
      .dismissAlert()
      // should redirect to root
      .assert.urlEquals('http://localhost:8080/navigation-guards/')
      // and should not render anything
      .assert.elementNotPresent('.view')

      .url('http://localhost:8080/navigation-guards/foo')
      .acceptAlert()
      .assert.urlEquals('http://localhost:8080/navigation-guards/foo')
      .assert.containsText('.view', 'foo')

      .url('http://localhost:8080/navigation-guards/bar')
      .dismissAlert()
      .waitFor(100)
      .dismissAlert()
      // should redirect to root
      .assert.urlEquals('http://localhost:8080/navigation-guards/')
      // and should not render anything
      .assert.elementNotPresent('.view')

      .url('http://localhost:8080/navigation-guards/bar')
      .acceptAlert()
      .assert.urlEquals('http://localhost:8080/navigation-guards/bar')
      .assert.containsText('.view', 'bar')
  },
  'navigation guards': function (browser) {
    browser
      // back to home
      .url('http://localhost:8080/navigation-guards/')
      .waitForElementVisible('#app', 1000)
      .assert.containsText('.view', 'home')

      .click('li:nth-child(4) a')
      .assert.urlEquals('http://localhost:8080/navigation-guards/baz')
      .assert.containsText('.view', 'baz (not saved)')
      .click('button')
      .assert.containsText('.view', 'baz (saved)')
      .click('li:nth-child(1) a')
      .assert.urlEquals('http://localhost:8080/navigation-guards/')
      .assert.containsText('.view', 'home')

      // in-component guard
      .click('li:nth-child(5) a')
      .assert.urlEquals('http://localhost:8080/navigation-guards/')
      .assert.containsText('.view', 'home')
      .waitFor(300)
      .assert.urlEquals('http://localhost:8080/navigation-guards/qux')
      .assert.containsText('.view', 'Qux')

      // async component + in-component guard
      .click('li:nth-child(1) a')
      .assert.urlEquals('http://localhost:8080/navigation-guards/')
      .assert.containsText('.view', 'home')
      .click('li:nth-child(6) a')
      .assert.urlEquals('http://localhost:8080/navigation-guards/')
      .assert.containsText('.view', 'home')
      .waitFor(300)
      .assert.urlEquals('http://localhost:8080/navigation-guards/qux-async')
      .assert.containsText('.view', 'Qux')

      // beforeRouteUpdate
      .click('li:nth-child(7) a')
      .assert.urlEquals('http://localhost:8080/navigation-guards/quux/1')
      .assert.containsText('.view', 'id:1 prevId:0')
      .click('li:nth-child(8) a')
      .assert.urlEquals('http://localhost:8080/navigation-guards/quux/2')
      .assert.containsText('.view', 'id:2 prevId:1')
      .click('li:nth-child(7) a')
      .assert.urlEquals('http://localhost:8080/navigation-guards/quux/1')
      .assert.containsText('.view', 'id:1 prevId:2')

      // beforeRouteEnter order in children
      .click('li:nth-child(9) a')
      .assert.urlEquals('http://localhost:8080/navigation-guards/parent/child/2')
      .assert.containsText('#bre-order', 'parent mixin child 2')
      .click('#nested-parent a')
      .assert.urlEquals('http://localhost:8080/navigation-guards/parent/child/1')
      .assert.containsText('#bre-order', 'parent mixin child 2 mixin child 1')
      .end()
  }
}
