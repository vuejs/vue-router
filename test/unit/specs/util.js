var util = require('../../../src/util')

describe('Util', function () {

  it('resolvePath', function () {
    expect(util.resolvePath('/a', 'b')).toBe('/b')
    expect(util.resolvePath('/a/', 'b')).toBe('/a/b')
    expect(util.resolvePath('/a', '/b')).toBe('/b')
    expect(util.resolvePath('/a/', '/b')).toBe('/a/b')
    // append mode
    expect(util.resolvePath('/a', 'b', true)).toBe('/a/b')
    expect(util.resolvePath('/a/', 'b', true)).toBe('/a/b')
    expect(util.resolvePath('/a', '/b', true)).toBe('/a/b')
    expect(util.resolvePath('/a/', '/b', true)).toBe('/a/b')
    // relative query
    expect(util.resolvePath('/a', '?b=1')).toBe('/a?b=1')
    expect(util.resolvePath('/a/', '?b=1')).toBe('/a/?b=1')
  })

  it('mapParams', function () {
    expect(util.mapParams('/a/:id', { id: 'b' })).toBe('/a/b')
    expect(util.mapParams('/a/:id/', { id: 'b' })).toBe('/a/b/')
    expect(util.mapParams('/a/:id/c/:d', { id: 'b', d: 'd' })).toBe('/a/b/c/d')
    expect(util.mapParams('/a/:id/c/:d', { id: 'b', d: 'd' }, { e: 123 })).toBe('/a/b/c/d?e=123')
  })

  it('resolveAsyncComponent', function (done) {
    var handler = {
      component: function (resolve) {
        setTimeout(function () {
          resolve({
            template: 'hi'
          })
        }, 0)
      }
    }
    util.resolveAsyncComponent(handler, function (Component) {
      expect(Component.options.template).toBe('hi')
      done()
    })
  })

  it('getRouteConfig', function () {
    expect(util.getRouteConfig({}, 'data')).toBeUndefined()
    expect(util.getRouteConfig({ options: { route: {}}}, 'data')).toBeUndefined()
    expect(util.getRouteConfig({ options: { route: { data: 1 }}}, 'data')).toBe(1)
    expect(util.getRouteConfig({ $options: { route: {}}}, 'data')).toBeUndefined()
    expect(util.getRouteConfig({ $options: { route: { data: 1 }}}, 'data')).toBe(1)
  })

})
