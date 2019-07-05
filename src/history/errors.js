export class NavigationDuplicated extends Error {
  constructor () {
    super('Navigating to current location is not allowed')
    this.name = this.constructor.name
  }
}
