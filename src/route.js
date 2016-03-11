const internalKeysRE = /^(component|subRoutes|fullPath)$/

/**
 * Route Context Object
 *
 * @param {String} path
 * @param {Router} router
 */

export default class Route {

  constructor (path, router) {
    const matched = router._recognizer.recognize(path)
    if (matched) {
      // copy all custom fields from route configs
      [].forEach.call(matched, match => {
        for (let key in match.handler) {
          if (!internalKeysRE.test(key)) {
            this[key] = match.handler[key]
          }
        }
      })
      // set query and params
      this.query = matched.queryParams
      this.params = [].reduce.call(matched, (prev, cur) => {
        if (cur.params) {
          for (let key in cur.params) {
            prev[key] = cur.params[key]
          }
        }
        return prev
      }, {})
    }
    // expose path and router
    this.path = path
    // for internal use
    this.matched = matched || router._notFoundHandler
    // internal reference to router
    Object.defineProperty(this, 'router', {
      enumerable: false,
      value: router
    })
    // Important: freeze self to prevent observation
    Object.freeze(this)
  }
}
