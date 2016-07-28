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
  const basePath = (current && current.path) || '/'
  const path = parsedPath.path
    ? resolvePath(parsedPath.path, basePath, append)
    : (current && current.path) || '/'
  const query = resolveQuery(parsedPath.query, next.query)
  let hash = next.hash || parsedPath.hash
  if (hash && hash.charAt(0) !== '#') {
    hash = `#${hash}`
  }

  return {
    _normalized: true,
    path,
    query,
    hash
  }
}
