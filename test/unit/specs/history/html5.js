var History = require('../../../../src/history/html5')

if (!isIE9) {
  describe('HTML5 History', function () {

    var url = location.href
    var pathname = location.pathname
    afterEach(function (done) {
      history.replaceState({}, '', url)
      setTimeout(done, 0)
    })

    it('notify change', function (done) {
      var history = new History({
        onChange: step1
      })
      history.start()
      // init
      function step1 (path) {
        expect(path).toBe(pathname)
        history.onChange = step2
        history.go('/what/the#lol')
      }
      // root path & hash
      function step2 (path, state, hash) {
        expect(location.pathname).toBe('/what/the')
        expect(path).toBe('/what/the')
        expect(state).toBeNull()
        expect(hash).toBe('#lol')
        history.onChange = step3
        history.go('huh', true)
      }
      // relative path
      function step3 (path) {
        expect(location.pathname).toBe('/what/huh')
        expect(path).toBe('/what/huh')
        done()
      }
    })

    it('root option', function (done) {
      var history = new History({
        onChange: step1,
        root: 'root/'
      })
      expect(history.root).toBe('/root')
      history.start()
      function step1 () {
        history.onChange = step2
        history.go('/haha')
      }
      function step2 (path) {
        expect(location.pathname).toBe('/root/haha')
        expect(path).toBe('/haha')
        done()
      }
    })

    it('respect <base>', function (done) {
      var base = document.createElement('base')
      base.setAttribute('href', '/base/')
      document.head.appendChild(base)
      var history = new History({
        onChange: step1
      })
      history.start()
      function step1 (path) {
        history.onChange = step2
        history.go('test')
      }
      function step2 (path) {
        expect(location.pathname).toBe('/base/test')
        expect(path).toBe('/base/test')
        document.head.removeChild(base)
        done()
      }
    })
  })
}
