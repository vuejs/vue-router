import { resolvePath } from '../util'
const hashRE = /#.*$/

export default class HTML5History {

  constructor ({ root, onChange }) {
    if (root && root !== '/') {
      // make sure there's the starting slash
      if (root.charAt(0) !== '/') {
        root = '/' + root
      }
      // remove trailing slash
      this.root = root.replace(/\/$/, '')
      this.rootRE = new RegExp('^\\' + this.root)
    } else {
      this.root = null
    }
    this.onChange = onChange
    // check base tag
    const baseEl = document.querySelector('base')
    this.base = baseEl && baseEl.getAttribute('href')
  }

  start () {
    this.listener = (e) => {
      let url = location.pathname + location.search
      if (this.root) {
        url = url.replace(this.rootRE, '') || '/'
      }
      this.onChange(url, e && e.state, location.hash)
    }
    window.addEventListener('popstate', this.listener)
    this.listener()
  }

  stop () {
    window.removeEventListener('popstate', this.listener)
  }

  go (path, replace, append) {
    const url = this.formatPath(path, append)
    // On iOS devices, after a long navigation (more than 100 replaceState or pushState)
    // it produce a DOM Exception 18.
    // Handle it by reloading the browser with the new url, to restart the counter.
    // Otherwise throw an error.
    try {
      this.changeState(url, replace)
    } catch (e) {
      if (e.message.match(/DOM Exception 18/)) {
        window.location = url
      } else {
        throw e
      }
    }
    const hashMatch = path.match(hashRE)
    const hash = hashMatch && hashMatch[0]
    path = url
      // strip hash so it doesn't mess up params
      .replace(hashRE, '')
      // remove root before matching
      .replace(this.rootRE, '')
    this.onChange(path, null, hash)
  }

  changeState (url, replace) {
    if (replace) {
      history.replaceState({}, '', url)
    } else {
      // record scroll position by replacing current state
      history.replaceState({
        pos: {
          x: window.pageXOffset,
          y: window.pageYOffset
        }
      }, '', location.href)
      // then push new state
      history.pushState({}, '', url)
    }
  }

  formatPath (path, append) {
    return path.charAt(0) === '/'
      // absolute path
      ? this.root
        ? this.root + '/' + path.replace(/^\//, '')
        : path
      : resolvePath(this.base || location.pathname, path, append)
  }
}
