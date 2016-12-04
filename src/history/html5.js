/* @flow */

import type VueRouter from '../index'
import { assert } from '../util/warn'
import { cleanPath } from '../util/path'
import { History } from './base'
import {
  saveScrollPosition,
  getScrollPosition,
  isValidPosition,
  normalizePosition,
  getElementPosition
} from '../util/scroll-position'

const genKey = () => String(Date.now())
let _key: string = genKey()

export class HTML5History extends History {
  constructor (router: VueRouter, base: ?string) {
    super(router, base)

    const expectScroll = router.options.scrollBehavior
    window.addEventListener('popstate', e => {
      _key = e.state && e.state.key
      const current = this.current
      this.transitionTo(getLocation(this.base), next => {
        if (expectScroll) {
          this.handleScroll(next, current, true)
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

  push (location: RawLocation) {
    const current = this.current
    this.transitionTo(location, route => {
      pushState(cleanPath(this.base + route.fullPath))
      this.handleScroll(route, current, false)
    })
  }

  replace (location: RawLocation) {
    const current = this.current
    this.transitionTo(location, route => {
      replaceState(cleanPath(this.base + route.fullPath))
      this.handleScroll(route, current, false)
    })
  }

  ensureURL (push?: boolean) {
    if (getLocation(this.base) !== this.current.fullPath) {
      const current = cleanPath(this.base + this.current.fullPath)
      push ? pushState(current) : replaceState(current)
    }
  }

  handleScroll (to: Route, from: Route, isPop: boolean) {
    const router = this.router
    if (!router.app) {
      return
    }

    const behavior = router.options.scrollBehavior
    if (!behavior) {
      return
    }
    if (process.env.NODE_ENV !== 'production') {
      assert(typeof behavior === 'function', `scrollBehavior must be a function`)
    }

    // wait until re-render finishes before scrolling
    router.app.$nextTick(() => {
      let position = getScrollPosition(_key)
      const shouldScroll = behavior(to, from, isPop ? position : null)
      if (!shouldScroll) {
        return
      }
      const isObject = typeof shouldScroll === 'object'
      if (isObject && typeof shouldScroll.selector === 'string') {
        const el = document.querySelector(shouldScroll.selector)
        if (el) {
          position = getElementPosition(el)
        } else if (isValidPosition(shouldScroll)) {
          position = normalizePosition(shouldScroll)
        }
      } else if (isObject && isValidPosition(shouldScroll)) {
        position = normalizePosition(shouldScroll)
      }

      if (position) {
        window.scrollTo(position.x, position.y)
      }
    })
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
    window.location[replace ? 'assign' : 'replace'](url)
  }
}

function replaceState (url: string) {
  pushState(url, true)
}
