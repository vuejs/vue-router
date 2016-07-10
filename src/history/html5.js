import { History } from './base'

export class HTML5History extends History {
  constructor (router) {
    super(router)
    window.addEventListener('popstate', () => {
      this.transitionTo(getLocation())
    })
  }

  go (n) {
    window.history.go(n)
  }

  push (location) {
    super.push(location, resolvedLocation => {
      window.history.pushState({}, '', resolvedLocation.fullPath)
    })
  }

  replace () {
    super.replace(location, resolvedLocation => {
      window.history.replaceState({}, '', resolvedLocation.fullPath)
    })
  }
}

function getLocation () {
  return window.location.pathname + window.location.search
}
