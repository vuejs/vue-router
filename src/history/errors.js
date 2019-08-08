export class NavigationDuplicated extends Error {
  constructor () {
    super('Navigating to current location is not allowed')
    this.name = this._name = 'NavigationDuplicated'
  }
}

// support IE9
NavigationDuplicated._name = 'NavigationDuplicated'
