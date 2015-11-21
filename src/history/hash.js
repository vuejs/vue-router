import { resolvePath } from '../util'

export default class HashHistory {

  constructor ({ hashbang, onChange }) {
    this.hashbang = hashbang
    this.onChange = onChange
  }

  start () {
    let self = this
    this.listener = function () {
      let path = location.hash
      let raw = path.replace(/^#!?/, '')
      // always
      if (raw.charAt(0) !== '/') {
        raw = '/' + raw
      }
      let formattedPath = self.formatPath(raw)
      if (formattedPath !== path) {
        location.replace(formattedPath)
        return
      }
      // determine query
      // note it's possible to have queries in both the actual URL
      // and the hash fragment itself.
      let query = location.search && path.indexOf('?') > -1
          ? '&' + location.search.slice(1)
          : location.search
      self.onChange(decodeURI(path.replace(/^#!?/, '') + query))
    }
    window.addEventListener('hashchange', this.listener)
    this.listener()
  }

  stop () {
    window.removeEventListener('hashchange', this.listener)
  }

  go (path, replace, append) {
    path = this.formatPath(path, append)
    if (replace) {
      location.replace(path)
    } else {
      location.hash = path
    }
  }

  formatPath (path, append) {
    let isAbsoloute = path.charAt(0) === '/'
    let prefix = '#' + (this.hashbang ? '!' : '')
    return isAbsoloute
      ? prefix + path
      : prefix + resolvePath(
          location.hash.replace(/^#!?/, ''),
          path,
          append
        )
  }
}
