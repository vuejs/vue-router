export class NavigationDuplicated extends Error {
  constructor () {
    super('Navigating to current location is not allowed')
    Object.setPrototypeOf(this, new.target.prototype)
  }
}
