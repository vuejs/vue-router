module.exports = {
  'auth flow': function (browser) {
    browser
      .url('http://localhost:8080/auth-flow/')
      .waitForElementVisible('#app', 1000)
      .assert.containsText('#app p', 'You are logged out')

      .click('li:nth-child(3) a')
      .assert.urlEquals('http://localhost:8080/auth-flow/login?redirect=%2Fdashboard')
      .assert.containsText('#app h2', 'Login')
      .assert.containsText('#app p', 'You need to login first.')

      .click('button')
      .assert.urlEquals('http://localhost:8080/auth-flow/login?redirect=%2Fdashboard')
      .assert.elementPresent('.error')

      .setValue('input[type=password]', 'password1')
      .click('button')
      .assert.urlEquals('http://localhost:8080/auth-flow/dashboard')
      .assert.containsText('#app h2', 'Dashboard')
      .assert.containsText('#app p', 'Yay you made it!')

    // reload
      .url('http://localhost:8080/auth-flow/')
      .waitForElementVisible('#app', 1000)
      .assert.containsText('#app p', 'You are logged in')

      // navigate when logged in
      .click('li:nth-child(3) a')
      .assert.urlEquals('http://localhost:8080/auth-flow/dashboard')
      .assert.containsText('#app h2', 'Dashboard')
      .assert.containsText('#app p', 'Yay you made it!')

    // directly visit dashboard when logged in
      .url('http://localhost:8080/auth-flow/dashboard')
      .waitForElementVisible('#app', 1000)
      .assert.urlEquals('http://localhost:8080/auth-flow/dashboard')
      .assert.containsText('#app h2', 'Dashboard')
      .assert.containsText('#app p', 'Yay you made it!')

      // log out
      .click('li:nth-child(1) a')
      .assert.urlEquals('http://localhost:8080/auth-flow/')
      .assert.containsText('#app p', 'You are logged out')

    // directly visit dashboard when logged out
      .url('http://localhost:8080/auth-flow/dashboard')
      .waitForElementVisible('#app', 1000)
      .assert.urlEquals('http://localhost:8080/auth-flow/login?redirect=%2Fdashboard')
      .assert.containsText('#app h2', 'Login')
      .assert.containsText('#app p', 'You need to login first.')
      .end()
  }
}
