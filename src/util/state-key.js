/* @flow */
import { inBrowser } from './dom'

export function getCurrentStateKey (): number {
  const state = window.history.state
  if (state && typeof state.key === 'number') {
    return state.key
  }
  return 1
}

export function genStateKey (): number {
  return getCurrentStateKey() + 1
}

let _key: number = inBrowser ? getCurrentStateKey() : -1

export function getStateKey () {
  return _key
}

export function setStateKey (key: number) {
  return (_key = key)
}
