import { resolvePath } from '../util'

export default class AbstractHistory {

  constructor ({ onChange }) {
    this.onChange = onChange
    this.currentPath = '/'
  }

  start () {
    this.onChange('/')
  }

  stop () {
    // noop
  }

  go (path, replace, append, force) {
    path = this.currentPath = this.formatPath(path, append)
    this.onChange(path, null, null, force)
  }

  formatPath (path, append) {
    return path.charAt(0) === '/'
      ? path
      : resolvePath(this.currentPath, path, append)
  }
}
