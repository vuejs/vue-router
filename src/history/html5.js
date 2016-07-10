import { History } from './base'

export class HTML5History extends History {
  constructor (router) {
    super(router)
    window.addEventListener('popstate', () => {

    })
  }

  go (n) {
    window.history.go(n)
  }

  push () {

  }

  replace () {

  }
}
