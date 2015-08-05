var util = require('../util')

function HashHistory (options) {
  this.hashbang = options.hashbang
  this.onChange = options.onChange || function () {}
}

var p = HashHistory.prototype

p.start = function () {
  var self = this
  this.listener = function () {
    var path = location.hash
    var formattedPath = self.formatPath(path)
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

p.replace = function (path) {
  this.go(path, true)
}

p.formatPath = function (path) {
  path = path.replace(/^#!?/, '')
  var prefix = '#' + (this.hashbang ? '!' : '')
  return path.charAt(0) === '/'
    ? prefix + path
    : prefix + util.resolvePath(
        location.hash.replace(/^#!?/, ''),
        path
      )
}

module.exports = HashHistory
