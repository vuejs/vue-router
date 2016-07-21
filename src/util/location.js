import { parsePath, resolvePath } from './path'
import { resolveQuery } from './query'

export function normalizeLocation (next, current) {
  if (typeof next === 'string') {
    next = {
      path: next
    }
  }

  if (next.name || next._normalized) {
    return next
  }

  let { path, query, hash } = parsePath(next.path || '')
  path = resolvePath(path, current && current.path, next.append)
  query = resolveQuery(query, next.query)

  return {
    _normalized: true,
    path,
    query,
    hash
  }
}

export function isSameLocation (a, b) {
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

function isObjectEqual (a = {}, b = {}) {
  const aKeys = Object.keys(a)
  const bKeys = Object.keys(b)
  if (aKeys.length !== bKeys.length) {
    return false
  }
  return aKeys.every(key => String(a[key]) === String(b[key]))
}
