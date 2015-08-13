var History = require('../../../../src/history/hash')

describe('Hash History', function () {

  it('notify change', function (done) {
    var history = new History({
      onChange: step1
    })
    history.start()
    // init
    function step1 (path) {
      expect(location.hash).toBe('#/')
      expect(path).toBe('/')
      history.onChange = step2
      history.go('/what/the')
    }
    // root path & hash
    function step2 (path) {
      expect(location.hash).toBe('#/what/the')
      expect(path).toBe('/what/the')
      history.onChange = step3
      history.go('huh', true)
    }
    // relative path
    function step3 (path) {
      expect(location.hash).toBe('#/what/huh')
      expect(path).toBe('/what/huh')
      history.stop()
      window.addEventListener('hashchange', function onChange () {
        window.removeEventListener('hashchange', onChange)
        done()
      })
      location.hash = ''
    }
  })

  it('hashbang option', function (done) {
    var history = new History({
      onChange: step1,
      hashbang: true
    })
    history.start()
    // init
    function step1 (path) {
      expect(path).toBe('/')
      history.onChange = step2
      history.go('/what/the')
    }
    // root path & hash
    function step2 (path) {
      expect(location.hash).toBe('#!/what/the')
      expect(path).toBe('/what/the')
      history.onChange = step3
      history.go('huh', true)
    }
    // relative path
    function step3 (path) {
      expect(location.hash).toBe('#!/what/huh')
      expect(path).toBe('/what/huh')
      history.stop()
      location.hash = ''
      done()
    }
  })

})
