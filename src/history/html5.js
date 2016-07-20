import { inBrowser } from '../util/dom'
import { History } from './base'

export class HTML5History extends History {
  constructor (router, base) {
    super(router)
    this.base = normalizeBae(base)
    window.addEventListener('popstate', () => {
      this.transitionTo(this.getLocation())
    })
  }

  go (n) {
    window.history.go(n)
  }

  push (location) {
    super.push(location, resolvedLocation => {
      const url = cleanURL(this.base + resolvedLocation.fullPath)
      window.history.pushState({}, '', url)
    })
  }

  replace () {
    super.replace(location, resolvedLocation => {
      const url = cleanURL(this.base + resolvedLocation.fullPath)
      window.history.replaceState({}, '', url)
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

function cleanURL (url) {
  return url.replace(/\/\//g, '/')
}
