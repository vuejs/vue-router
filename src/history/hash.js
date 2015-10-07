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
      let pathToMatch = decodeURI(
        path.replace(/^#!?/, '') + location.search
      )
      self.onChange(pathToMatch)
    }
    window.addEventListener('hashchange', this.listener)
    this.listener()
  }

  stop () {
    window.removeEventListener('hashchange', this.listener)
  }

  go (path, replace) {
    path = this.formatPath(path)
    if (replace) {
      location.replace(path)
    } else {
      location.hash = path
    }
  }

  formatPath (path) {
    let isAbsoloute = path.charAt(0) === '/'
    let prefix = '#' + (this.hashbang ? '!' : '')
    return isAbsoloute
      ? prefix + path
      : prefix + resolvePath(
          location.hash.replace(/^#!?/, ''),
          path
        )
  }
}
