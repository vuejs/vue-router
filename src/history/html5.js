var util = require('../util')
var hashRE = /#.*$/

function HTML5History (options) {
  var root = options.root
  if (root) {
    // make sure there's the starting slash
    if (root.charAt(0) !== '/') {
      root = '/' + root
    }
    // remove trailing slash
    this.root = root.replace(/\/$/, '')
  } else {
    this.root = null
  }
  this.onChange = options.onChange
}

var p = HTML5History.prototype

p.start = function () {
  var self = this
  var baseEl = document.querySelector('base')
  var base = baseEl && baseEl.getAttribute('href')
  this.listener = function (e) {
    var url = decodeURI(location.pathname + location.search)
    if (base) {
      url = url.replace(base, '')
    }
    self.onChange(url, e && e.state, location.hash)
  }
  window.addEventListener('popstate', this.listener)
  this.listener()
}

p.stop = function () {
  window.removeEventListener('popstate', this.listener)
}

p.go = function (path, replace) {
  var url = this.formatPath(path, this.root)
  if (replace) {
    history.replaceState({}, '', url)
  } else {
    // record scroll position by replacing current state
    history.replaceState({
      pos: {
        x: window.pageXOffset,
        y: window.pageYOffset
      }
    }, '')
    // then push new state
    history.pushState({}, '', url)
  }
  var hashMatch = path.match(hashRE)
  var hash = hashMatch && hashMatch[0]
  // strip hash so it doesn't mess up params
  path = url.replace(hashRE, '')
  this.onChange(path, null, hash)
}

p.formatPath = function (path) {
  return path.charAt(0) === '/'
    // absolute path
    ? this.root
      ? this.root + '/' + path.replace(/^\//, '')
      : path
    : util.resolvePath(location.pathname, path)
}

module.exports = HTML5History
