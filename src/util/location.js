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
