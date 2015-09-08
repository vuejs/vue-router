const internalKeysRE = /^(component|subRoutes)$/

/**
 * Route Context Object
 *
 * @param {String} path
 * @param {Router} router
 */

export default class Route {

  constructor (path, router) {
    let matched = router._recognizer.recognize(path)

    // copy all custom fields from route configs
    if (matched) {
      [].forEach.call(matched, match => {
        for (let key in match.handler) {
          if (!internalKeysRE.test(key)) {
            this[key] = match.handler[key]
          }
        }
      })
    }

    this.path = path
    this.router = router
    this.query = matched
      ? matched.queryParams
      : {}
    this.params = matched
      ? [].reduce.call(matched, (prev, cur) => {
          if (cur.params) {
            for (let key in cur.params) {
              prev[key] = cur.params[key]
            }
          }
          return prev
        }, {})
      : {}

    // private stuff
    this._matched = matched || router._notFoundHandler
  }
}
