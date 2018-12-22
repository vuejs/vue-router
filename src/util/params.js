/* @flow */

import { warn } from './warn'
import Regexp from 'path-to-regexp'

// $flow-disable-line
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
    if (params && params.pathMatch) {
      params[0] = params.pathMatch
    }
    return filler(params || {}, { pretty: true })
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') {
      warn(false, `missing param for ${routeMsg}: ${e.message}`)
    }
    return ''
  } finally {
    if (params && params[0]) {
      delete params[0]
    }
  }
}
