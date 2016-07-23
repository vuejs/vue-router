import { inBrowser } from '../util/dom'
import { cleanPath } from '../util/path'
import { History } from './base'

let _key = Date.now()

export class HTML5History extends History {
  constructor (router, base) {
    super(router, normalizeBae(base))

    // possible redirect on start
    if (this.getLocation() !== this.current.fullPath) {
      replaceState(this.current.fullPath)
    }

    const expectScroll = router.options.scrollBehavior

    window.addEventListener('popstate', e => {
      _key = e.state && e.state.key
      const current = this.current
      this.transitionTo(this.getLocation(), next => {
        if (expectScroll) {
          this.handleScroll(current, next)
        }
      })
    })

    if (expectScroll) {
      _key = Date.now()
      window.addEventListener('scroll', saveScrollPosition)
    }
  }

  go (n) {
    window.history.go(n)
  }

  push (location) {
    super.push(location, resolvedLocation => {
      const url = cleanPath(this.base + resolvedLocation.fullPath)
      pushState(url)
    })
  }

  replace (location) {
    super.replace(location, resolvedLocation => {
      const url = cleanPath(this.base + resolvedLocation.fullPath)
      replaceState(url)
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

  handleScroll (from, to) {
    const router = this.router
    if (!router.app) {
      return
    }

    let shouldScroll = false
    const behavior = router.options.scrollBehavior
    if (typeof behavior === 'boolean') {
      shouldScroll = behavior
    } else if (typeof behavior === 'function') {
      shouldScroll = behavior(from, to)
    }

    if (!shouldScroll) {
      return
    }

    let position = getScrollPosition()
    if (typeof shouldScroll === 'object' &&
        shouldScroll.x != null &&
        shouldScroll.y != null) {
      position = shouldScroll
    }
    if (position) {
      router.app.$nextTick(() => {
        window.scrollTo(position.x, position.y)
      })
    }
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

function pushState (url, replace) {
  // try...catch the pushState call to get around Safari
  // DOM Exception 18 where it limits to 100 pushState calls
  const history = window.history
  try {
    if (replace) {
      history.replaceState({ key: _key }, '', url)
    } else {
      _key = Date.now()
      history.pushState({ key: _key }, '', url)
    }
    saveScrollPosition()
  } catch (e) {
    window.location[replace ? 'assign' : 'replace'](url)
  }
}

function replaceState (url) {
  pushState(url, true)
}

function saveScrollPosition () {
  if (!_key) return
  window.sessionStorage.setItem(_key, JSON.stringify({
    x: window.pageXOffset,
    y: window.pageYOffset
  }))
}

function getScrollPosition () {
  if (!_key) return
  return JSON.parse(window.sessionStorage.getItem(_key))
}
