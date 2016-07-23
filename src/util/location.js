/* @flow */

import { parsePath, resolvePath } from './path'
import { resolveQuery } from './query'

export function normalizeLocation (
  raw: RawLocation,
  current?: Route,
  append?: boolean
): Location {
  const next: Location = typeof raw === 'string' ? { path: raw } : raw
  if (next.name || next._normalized) {
    return next
  }

  const parsedPath = parsePath(next.path || '')
  const path = resolvePath(parsedPath.path, current && current.path, append)
  const query = resolveQuery(parsedPath.query, next.query)
  const hash = parsedPath.hash

  return {
    _normalized: true,
    path,
    query,
    hash
  }
}

export function isSameRoute (a: Route, b: ?Route): boolean {
  if (!b) {
    return false
  } else if (a.path && b.path) {
    return (
      a.path === b.path &&
      a.hash === b.hash &&
      isObjectEqual(a.query, b.query)
    )
  } else if (a.name && b.name) {
    return (
      a.name === b.name &&
      a.hash === b.hash &&
      isObjectEqual(a.query, b.query) &&
      isObjectEqual(a.params, b.params)
    )
  } else {
    return false
  }
}

function isObjectEqual (a = {}, b = {}): boolean {
  const aKeys = Object.keys(a)
  const bKeys = Object.keys(b)
  if (aKeys.length !== bKeys.length) {
    return false
  }
  return aKeys.every(key => String(a[key]) === String(b[key]))
}
