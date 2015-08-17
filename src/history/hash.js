import { resolvePath } from '../util'

export default class HashHistory {

  constructor (options) {
    this.hashbang = options.hashbang
    this.onChange = options.onChange
  }

  start () {
    let self = this
    this.listener = function () {
      let path = location.hash
      let formattedPath = self.formatPath(path, true)
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

  formatPath (path, expectAbsolute) {
    path = path.replace(/^#!?/, '')
    let isAbsoloute = path.charAt(0) === '/'
    if (expectAbsolute && !isAbsoloute) {
      path = '/' + path
    }
    let prefix = '#' + (this.hashbang ? '!' : '')
    return isAbsoloute || expectAbsolute
      ? prefix + path
      : prefix + resolvePath(
          location.hash.replace(/^#!?/, ''),
          path
        )
  }
}
