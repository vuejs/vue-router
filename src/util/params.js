/* @flow */

import Regexp from 'path-to-regexp'
import { warn } from './warn'

const regexpCache: {
  [key: string]: {
    keys: Array<?{ name: string }>,
    regexp: RegExp
  }
} = Object.create(null)

export function getRouteRegex (path: string): Object {
  const hit = regexpCache[path]
  let keys, regexp

  if (hit) {
    keys = hit.keys
    regexp = hit.regexp
  } else {
    keys = []
    regexp = Regexp(path, keys)
    regexpCache[path] = { keys, regexp }
  }

  return { keys, regexp }
}

const regexpCompileCache: {
  [key: string]: Function
} = Object.create(null)

export function fillParams (
  path: string,
  params: ?Object,
  routeMsg: string
): string {
  try {
    const filler =
      regexpCompileCache[path] ||
      (regexpCompileCache[path] = Regexp.compile(path))
    return filler(params || {}, { pretty: true })
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') {
      warn(false, `missing param for ${routeMsg}: ${e.message}`)
    }
    return ''
  }
}
