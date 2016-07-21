import { History } from './base'
import { normalizeLocation, isSameLocation } from '../util/location'

export class HashHistory extends History {
  constructor (router) {
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
    const location = normalizeLocation(getHash())
    // ignore location change triggered by router navigation
    if (isSameLocation(location, this.current)) {
      return
    }
    this.transitionTo(location, resolvedLocation => {
      replaceHash(resolvedLocation.fullPath)
    })
  }

  push (location) {
    super.push(location, resolvedLocation => {
      pushHash(resolvedLocation.fullPath)
    })
  }

  replace (location) {
    super.replace(location, resolvedLocation => {
      replaceHash(resolvedLocation.fullPath)
    })
  }

  go (n) {
    window.history.go(n)
  }

  getLocation () {
    return getHash()
  }
}

function ensureSlash () {
  const path = getHash()
  if (path.charAt(0) === '/') {
    return true
  }
  replaceHash('/' + path)
  return false
}

function getHash () {
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
