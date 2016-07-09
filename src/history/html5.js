import { History } from './base'

export class HTML5History extends History {
  constructor (match, root) {
    super(match)
    this.root = root
  }
}
