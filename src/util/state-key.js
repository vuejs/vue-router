/* @flow */

export function getCurrentStateKey (): number {
  const state = window.history.state
  if (state && typeof state.key === 'number') {
    return state.key
  }
  return 1
}

export function genStateKey (): string {
  return getCurrentStateKey() + 1
}

let _key: string = getCurrentStateKey()

export function getStateKey () {
  return _key
}

export function setStateKey (key: string) {
  return (_key = key)
}
