import Regexp from 'path-to-regexp'
import { stringifyQuery } from './query'
import { createRouteMap } from './route-map'
import { normalizeLocation } from './location'

export function createMatcher (routes) {
  const { pathMap, nameMap } = createRouteMap(routes)

  return function match (location, currentLocation) {
    const {
      name,
      path,
      query = {},
      params = {}
    } = normalizeLocation(location, currentLocation)

    if (name) {
      const entry = nameMap[name]
      if (entry) {
        try {
          const path = Regexp.compile(entry.path)(params)
        } catch (e) {
          throw new Error(`[vue-router] missing params for named route "${name}": ${e.message}`)
        }
        return Object.freeze({
          name,
          path,
          fullPath: path + stringifyQuery(query),
          query,
          params,
          matched: formatMatch(entry)
        })
      }
    } else {
      const params = {}
      for (const route in pathMap) {
        if (matchRoute(route, params, path)) {
          return Object.freeze({
            path,
            fullPath: path + stringifyQuery(query),
            query,
            params,
            matched: formatMatch(pathMap[route])
          })
        }
      }
    }
  }
}

function matchRoute (path, params, pathname) {
  const keys = []
  const regexp = Regexp(path, keys)
  const m = regexp.exec(pathname)

  if (!m) {
    return false
  } else if (!params) {
    return true
  }

  for (let i = 1, len = m.length; i < len; ++i) {
    const key = keys[i - 1]
    const val = typeof m[i] === 'string' ? decodeURIComponent(m[i]) : m[i]
    if (key) params[key.name] = val
  }

  return true
}

function formatMatch (record) {
  const res = []
  while (record) {
    res.unshift(record)
    record = record.parent
  }
  return res
}
