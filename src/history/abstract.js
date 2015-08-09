var util = require('../util')

function AbstractHistory (options) {
  this.onChange = options.onChange
  this.currentPath = '/'
}

var p = AbstractHistory.prototype

p.start = function () {
  this.onChange('/')
}

p.stop = function () {}

p.go = function (path) {
  path = this.currentPath = this.formatPath(path)
  this.onChange(path)
}

p.formatPath = function (path) {
  return path.charAt(0) === '/'
    ? path
    : util.resolvePath(this.currentPath, path)
}

module.exports = AbstractHistory
