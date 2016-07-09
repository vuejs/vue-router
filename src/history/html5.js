import { History } from './base'

export class HTML5History extends History {
  construcotr (router) {
    super(router)
  }

  go (n) {
    window.history.go(n)
  }
}
