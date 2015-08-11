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
    this.rootRE = new RegExp('^\\' + this.root)
  } else {
    this.root = null
  }
  this.onChange = options.onChange
  // check base tag
  var baseEl = document.querySelector('base')
  this.base = baseEl && baseEl.getAttribute('href')
}

var p = HTML5History.prototype

p.start = function () {
  var self = this
  this.listener = function (e) {
    var url = decodeURI(location.pathname + location.search)
    if (this.root) {
      url = url.replace(this.rootRE, '')
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
  var root = this.root
  var url = this.formatPath(path, root)
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
  path = url
    // strip hash so it doesn't mess up params
    .replace(hashRE, '')
    // remove root before matching
    .replace(this.rootRE, '')
  this.onChange(path, null, hash)
}

p.formatPath = function (path) {
  return path.charAt(0) === '/'
    // absolute path
    ? this.root
      ? this.root + '/' + path.replace(/^\//, '')
      : path
    : util.resolvePath(this.base || location.pathname, path)
}

module.exports = HTML5History
