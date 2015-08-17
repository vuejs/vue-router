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

  go (path) {
    path = this.currentPath = this.formatPath(path)
    this.onChange(path)
  }

  formatPath (path) {
    return path.charAt(0) === '/'
      ? path
      : resolvePath(this.currentPath, path)
  }
}
