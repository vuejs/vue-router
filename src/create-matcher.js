import Regexp from 'path-to-regexp'
import { createRouteMap } from './create-route-map'
import { resolvePath } from './util/path'
import { stringifyQuery } from './util/query'
import { normalizeLocation } from './util/location'

export function createMatcher (routes) {
  const { pathMap, nameMap } = createRouteMap(routes)

  /**
   * This functions returns a "resolvedLocation", which is
   * also the "$route" object injected into components.
   */
  function match (location, currentLocation) {
    location = normalizeLocation(location, currentLocation)

    const {
      name,
      path,
      hash = '',
      query = {},
      params = {}
    } = location

    if (name) {
      const record = nameMap[name]
      if (record) {
        if (record.redirect) {
          return redirect(record, location)
        }
        let path
        try {
          path = Regexp.compile(record.path)(params)
        } catch (e) {
          throw new Error(`[vue-router] missing params for named route "${name}": ${e.message}`)
        }
        return Object.freeze({
          name,
          path,
          hash,
          query,
          params,
          fullPath: getFullPath(path, query, hash),
          matched: formatMatch(record)
        })
      }
    } else {
      const params = {}
      for (const route in pathMap) {
        if (matchRoute(route, params, path)) {
          const record = pathMap[route]
          if (record.redirect) {
            return redirect(record, location)
          }
          return Object.freeze({
            path,
            hash,
            query,
            params,
            fullPath: getFullPath(path, query, hash),
            matched: formatMatch(record)
          })
        }
      }
    }
  }

  function redirect (record, location, currentLocation) {
    let path
    const name = typeof record.redirect === 'object' && record.redirect.name
    if (name) {
      // resolved named direct
      const record = nameMap[name]
      if (!record) {
        throw new Error(`[vue-router] redirect failed: named route "${name}" not found.`)
      }
      path = record.path
    } else if (typeof record.redirect === 'string') {
      // resolve relative redirect
      path = resolvePath(record.redirect, record.parent ? record.parent.path : '/', true)
    }
    // 2. resolve params
    path = Regexp.compile(path)(location.params)
    // 3. rematch with existing query and hash
    return match({
      _normalized: true,
      path,
      query: location.query,
      hash: location.hash
    })
  }

  return match
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

function getFullPath (path, query, hash) {
  return path + stringifyQuery(query) + hash
}

function formatMatch (record) {
  const res = []
  while (record) {
    res.unshift(record)
    record = record.parent
  }
  return res
}
