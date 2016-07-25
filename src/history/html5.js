/* @flow */

import type VueRouter from '../index'
import { assert } from '../util/warn'
import { cleanPath } from '../util/path'
import { History } from './base'

const genKey = () => String(Date.now())
let _key: string = genKey()

export class HTML5History extends History {
  constructor (router: VueRouter, base: ?string) {
    super(router, base)

    // possible redirect on start
    const url = cleanPath(this.base + this.current.fullPath)
    if (this.getLocation() !== url) {
      replaceState(url)
    }

    const expectScroll = router.options.scrollBehavior

    window.addEventListener('popstate', e => {
      _key = e.state && e.state.key
      const current = this.current
      this.transitionTo(this.getLocation(), next => {
        if (expectScroll) {
          this.handleScroll(next, current, true)
        }
      })
    })

    if (expectScroll) {
      window.addEventListener('scroll', saveScrollPosition)
    }
  }

  go (n: number) {
    window.history.go(n)
  }

  push (location: RawLocation) {
    const current = this.current
    super.transitionTo(location, route => {
      pushState(cleanPath(this.base + route.fullPath))
      this.handleScroll(route, current, false)
    })
  }

  replace (location: RawLocation) {
    const current = this.current
    super.transitionTo(location, route => {
      replaceState(cleanPath(this.base + route.fullPath))
      this.handleScroll(route, current, false)
    })
  }

  getLocation (): string {
    return getLocation(this.base)
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

    assert(typeof behavior === 'function', `scrollBehavior must be a function`)

    let position = getScrollPosition()
    const shouldScroll = behavior(to, from, isPop ? position : null)
    if (!shouldScroll) {
      return
    }

    // wait until re-render finishes before scrolling
    router.app.$nextTick(() => {
      const isObject = typeof shouldScroll === 'object'
      if (isObject && shouldScroll.x != null && shouldScroll.y != null) {
        position = shouldScroll
      } else if (isObject && shouldScroll.anchor) {
        const el = document.querySelector(to.hash)
        if (el) {
          const docTop = document.documentElement.getBoundingClientRect().top
          const elTop = el.getBoundingClientRect().top
          position = {
            x: window.scrollX,
            y: elTop - docTop
          }
        }
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
  return path + window.location.search + window.location.hash
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
    saveScrollPosition()
  } catch (e) {
    window.location[replace ? 'assign' : 'replace'](url)
  }
}

function replaceState (url: string) {
  pushState(url, true)
}

function saveScrollPosition () {
  if (!_key) return
  window.sessionStorage.setItem(_key, JSON.stringify({
    x: window.pageXOffset,
    y: window.pageYOffset
  }))
}

function getScrollPosition (): ?{ x: number, y: number } {
  if (!_key) return
  return JSON.parse(window.sessionStorage.getItem(_key))
}
