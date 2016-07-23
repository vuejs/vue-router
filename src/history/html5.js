import { inBrowser } from '../util/dom'
import { cleanPath } from '../util/path'
import { History } from './base'

export class HTML5History extends History {
  constructor (router, base) {
    super(router, normalizeBae(base))
    // possible redirect on start
    if (this.getLocation() !== this.current.fullPath) {
      window.history.replaceState({}, '', this.current.fullPath)
    }
    window.addEventListener('popstate', () => {
      this.transitionTo(this.getLocation())
    })
  }

  go (n) {
    window.history.go(n)
  }

  push (location) {
    super.push(location, resolvedLocation => {
      const url = cleanPath(this.base + resolvedLocation.fullPath)
      tryPushState(url)
    })
  }

  replace (location) {
    super.replace(location, resolvedLocation => {
      const url = cleanPath(this.base + resolvedLocation.fullPath)
      tryPushState(url, true)
    })
  }

  getLocation () {
    const base = this.base
    let path = window.location.pathname
    if (base && path.indexOf(base) === 0) {
      path = path.slice(base.length)
    }
    return path + window.location.search + window.location.hash
  }
}

/**
 * try...catch the pushState call to get around Safari
 * DOM Exception 18 where it limits to 100 pushState calls
 */
function tryPushState (url, replace) {
  try {
    window.history[replace ? 'replaceState' : 'pushState']({}, '', url)
  } catch (e) {
    window.location[replace ? 'assign' : 'replace'](url)
  }
}

function normalizeBae (base) {
  if (!base) {
    if (inBrowser) {
      // respect <base> tag
      const baseEl = document.querySelector('base')
      base = baseEl ? baseEl.getAttribute('href') : '/'
    } else {
      base = '/'
    }
  }
  // make sure there's the starting slash
  if (base.charAt(0) !== '/') {
    base = '/' + base
  }
  // remove trailing slash
  return base.replace(/\/$/, '')
}
