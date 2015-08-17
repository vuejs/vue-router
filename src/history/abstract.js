var util = require('../util')

function AbstractHistory (options) {
  this.onChange = options.onChange
  this.currentPath = '/'
}

AbstractHistory.prototype.start = function () {
  this.onChange('/')
}

AbstractHistory.prototype.stop = function () {
  // noop
}

AbstractHistory.prototype.go = function (path) {
  path = this.currentPath = this.formatPath(path)
  this.onChange(path)
}

AbstractHistory.prototype.formatPath = function (path) {
  return path.charAt(0) === '/'
    ? path
    : util.resolvePath(this.currentPath, path)
}

module.exports = AbstractHistory
