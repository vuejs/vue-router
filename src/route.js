function Route (path, router) {
  this.path = path
  var matched = router._recognizer.recognize(path)

  this.query = matched
    ? matched.queryParams
    : {}

  this.params = matched
    ? [].reduce.call(matched, function (prev, cur) {
        if (cur.params) {
          for (var key in cur.params) {
            prev[key] = cur.params[key]
          }
        }
        return prev
      }, {})
    : {}

  // private stuff
  this._aborted = false
  def(this, '_matched', matched || router._notFoundHandler)
  def(this, '_router', router)
}

function def (obj, key, val) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: false
  })
}

module.exports = Route
