/* @flow */

export function assert (condition: any, message: string) {
  if (!condition) {
    throw new Error(`[vue-router] ${message}`)
  }
}

export function warn (condition: any, message: string) {
  if (process.env.NODE_ENV !== 'production' && !condition) {
    typeof console !== 'undefined' && console.warn(`[vue-router] ${message}`)
  }
}

