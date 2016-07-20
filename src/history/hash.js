import { AbstractHistory } from './abstract'
import { supportsHistory } from '../util/dom'
import { normalizeLocation, isSameLocation } from '../util/location'

export class HashHistory extends AbstractHistory {
  constructor (router) {
    super(router)
    ensureSlash()
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
    // back button
    if (isSameLocation(location, this.stack[this.index - 1])) {
      super.go(-1)
      return
    }
    // forward button
    if (isSameLocation(location, this.stack[this.index + 1])) {
      super.go(1)
      return
    }
    // manual set hash?
    this.push(location)
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
    if (supportsHistory) {
      window.history.go(n)
    } else {
      super.go(n)
    }
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
