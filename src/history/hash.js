/* @flow */

import type VueRouter from '../index'
import { History } from './base'

export class HashHistory extends History {
  constructor (router: VueRouter) {
    super(router)
    ensureSlash()
    // possible redirect on start
    if (getHash() !== this.current.fullPath) {
      replaceHash(this.current.fullPath)
    }
    window.addEventListener('hashchange', () => {
      this.onHashChange()
    })
  }

  onHashChange () {
    if (!ensureSlash()) {
      return
    }
    this.transitionTo(this.getLocation(), route => {
      replaceHash(route.fullPath)
    })
  }

  push (location: RawLocation) {
    super.push(location, route => {
      pushHash(route.fullPath)
    })
  }

  replace (location: RawLocation) {
    super.replace(location, route => {
      replaceHash(route.fullPath)
    })
  }

  go (n: number) {
    window.history.go(n)
  }

  getLocation () {
    return getHash()
  }
}

function ensureSlash (): boolean {
  const path = getHash()
  if (path.charAt(0) === '/') {
    return true
  }
  replaceHash('/' + path)
  return false
}

function getHash (): string {
  // We can't use window.location.hash here because it's not
  // consistent across browsers - Firefox will pre-decode it!
  const href = window.location.href
  const index = href.indexOf('#')
  return index === -1 ? '' : href.slice(index + 1)
}

function pushHash (path) {
  window.location.hash = path
}

function replaceHash (path) {
  const i = window.location.href.indexOf('#')
  window.location.replace(
    window.location.href.slice(0, i >= 0 ? i : 0) + '#' + path
  )
}
