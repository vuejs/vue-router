/* @flow */

import type Router from '../index'
import { History } from './base'
import { inBrowser } from '../util/dom'
import { cleanPath } from '../util/path'
import { handleScroll, saveScrollPosition } from '../util/scroll'

// use User Timing api (if present) for more accurate key precision
const Time = inBrowser && window.performance && window.performance.now
  ? window.performance
  : Date

const genKey = () => String(Time.now())
let _key: string = genKey()

export class HTML5History extends History {
  constructor (router: Router, base: ?string) {
    super(router, base)

    const expectScroll = router.options.scrollBehavior
    window.addEventListener('popstate', e => {
      _key = e.state && e.state.key
      const current = this.current
      this.transitionTo(getLocation(this.base), next => {
        if (expectScroll) {
          handleScroll(router, _key, next, current, true)
        }
      })
    })

    if (expectScroll) {
      window.addEventListener('scroll', () => {
        saveScrollPosition(_key)
      })
    }
  }

  go (n: number) {
    window.history.go(n)
  }

  push (location: RawLocation, onComplete?: Function, onAbort?: Function) {
    const current = this.current
    this.transitionTo(location, route => {
      pushState(cleanPath(this.base + route.fullPath))
      handleScroll(this.router, _key, route, current, false)
      onComplete && onComplete(route)
    }, onAbort)
  }

  replace (location: RawLocation, onComplete?: Function, onAbort?: Function) {
    const current = this.current
    this.transitionTo(location, route => {
      replaceState(cleanPath(this.base + route.fullPath))
      handleScroll(this.router, _key, route, current, false)
      onComplete && onComplete(route)
    }, onAbort)
  }

  ensureURL (push?: boolean) {
    if (getLocation(this.base) !== this.current.fullPath) {
      const current = cleanPath(this.base + this.current.fullPath)
      push ? pushState(current) : replaceState(current)
    }
  }

  getCurrentLocation (): string {
    return getLocation(this.base)
  }
}

export function getLocation (base: string): string {
  let path = window.location.pathname
  if (base && path.indexOf(base) === 0) {
    path = path.slice(base.length)
  }
  return (path || '/') + window.location.search + window.location.hash
}

function pushState (url: string, replace?: boolean) {
  // try...catch the pushState call to get around Safari
  // DOM Exception 18 where it limits to 100 pushState calls
  const history = window.history
  try {
    if (replace) {
      history.replaceState({ key: _key }, '', url)
    } else {
      _key = genKey()
      history.pushState({ key: _key }, '', url)
    }
    saveScrollPosition(_key)
  } catch (e) {
    window.location[replace ? 'replace' : 'assign'](url)
  }
}

function replaceState (url: string) {
  pushState(url, true)
}
