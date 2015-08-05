var util = require('../util')

function HashHistory (options) {
  this.hashbang = options.hashbang
  this.onChange = options.onChange
}

var p = HashHistory.prototype

p.start = function () {
  var self = this
  this.listener = function () {
    var path = location.hash
    var formattedPath = self.formatPath(path, true)
    if (formattedPath !== path) {
      location.replace(formattedPath)
      return
    }
    var pathToMatch = decodeURI(
      path.replace(/^#!?/, '') + location.search
    )
    self.onChange(pathToMatch)
  }
  window.addEventListener('hashchange', this.listener)
  this.listener()
}

p.stop = function () {
  window.removeEventListener('hashchange', this.listener)
}

p.go = function (path, replace) {
  path = this.formatPath(path)
  if (replace) {
    location.replace(path)
  } else {
    location.hash = path
  }
}

p.formatPath = function (path, expectAbsolute) {
  path = path.replace(/^#!?/, '')
  var isAbsoloute = path.charAt(0) === '/'
  if (expectAbsolute && !isAbsoloute) {
    path = '/' + path
  }
  var prefix = '#' + (this.hashbang ? '!' : '')
  return isAbsoloute || expectAbsolute
    ? prefix + path
    : prefix + util.resolvePath(
        location.hash.replace(/^#!?/, ''),
        path
      )
}

module.exports = HashHistory
