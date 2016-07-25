/* @flow */

import Regexp from 'path-to-regexp'
import { assert, warn } from './util/warn'
import { createRouteMap } from './create-route-map'
import { resolvePath } from './util/path'
import { stringifyQuery } from './util/query'
import { normalizeLocation } from './util/location'

const regexpCache: {
  [key: string]: {
    keys: Array<?{ name: string }>,
    regexp: RegExp
  }
} = Object.create(null)

const regexpCompileCache: {
  [key: string]: Function
} = Object.create(null)

export function createMatcher (routes: Array<RouteConfig>): Matcher {
  const { pathMap, nameMap } = createRouteMap(routes)

  function match (raw: RawLocation, currentRoute?: Route): Route {
    const location = normalizeLocation(raw, currentRoute)
    const { name } = location

    if (name) {
      const record = nameMap[name]
      if (record) {
        location.path = fillParams(record.path, location.params, `named route "${name}"`)
        return createRouteContext(record, location)
      }
    } else if (location.path) {
      location.params = {}
      for (const path in pathMap) {
        if (matchRoute(path, location.params, location.path)) {
          return createRouteContext(pathMap[path], location)
        }
      }
    }
    // no match
    return createRouteContext(null, location)
  }

  function createRouteContext (record: ?RouteRecord, location: Location): Route {
    if (record && record.redirect) {
      return redirect(record, location)
    }
    if (record && record.matchAs) {
      return alias(record, location, record.matchAs)
    }
    return Object.freeze({
      name: location.name,
      path: location.path || '/',
      hash: location.hash || '',
      query: location.query || {},
      params: location.params || {},
      fullPath: getFullPath(location),
      matched: record ? formatMatch(record) : [],
      meta: record ? record.meta : {}
    })
  }

  function redirect (record: RouteRecord, location: Location): Route {
    const { query, hash, params } = location
    const { redirect } = record
    const name = redirect && typeof redirect === 'object' && redirect.name
    if (name) {
      // resolved named direct
      const targetRecord = nameMap[name]
      assert(targetRecord, `redirect failed: named route "${name}" not found.`)
      return match({
        _normalized: true,
        name,
        query,
        hash,
        params
      })
    } else if (typeof redirect === 'string') {
      // 1. resolve relative redirect
      const rawPath = resolveRecordPath(redirect, record)
      // 2. resolve params
      const path = fillParams(rawPath, params, `redirect route with path "${rawPath}"`)
      // 3. rematch with existing query and hash
      return match({
        _normalized: true,
        path,
        query,
        hash
      })
    } else {
      warn(`invalid redirect option: ${JSON.stringify(redirect)}`)
      return createRouteContext(null, location)
    }
  }

  function alias (record: RouteRecord, location: Location, matchAs: string): Route {
    const aliasedPath = fillParams(matchAs, location.params, `aliased route with path "${matchAs}"`)
    const aliasedMatch = match({
      _normalized: true,
      path: aliasedPath
    })
    if (aliasedMatch) {
      const matched = aliasedMatch.matched
      const aliasedRecord = matched[matched.length - 1]
      location.params = aliasedMatch.params
      return createRouteContext(aliasedRecord, location)
    }
    return createRouteContext(null, location)
  }

  return match
}

function matchRoute (path: string, params: Object, pathname: string): boolean {
  let keys, regexp
  const hit = regexpCache[path]
  if (hit) {
    keys = hit.keys
    regexp = hit.regexp
  } else {
    keys = []
    regexp = Regexp(path, keys)
    regexpCache[path] = { keys, regexp }
  }
  const m = pathname.match(regexp)

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

function formatMatch (record: ?RouteRecord): Array<RouteRecord> {
  const res = []
  while (record) {
    res.unshift(record)
    record = record.parent
  }
  return res
}

function fillParams (path: string, params: ?Object, routeMsg: string): string {
  try {
    const filler =
      regexpCompileCache[path] ||
      (regexpCompileCache[path] = Regexp.compile(path))
    return filler(params || {}, { pretty: true })
  } catch (e) {
    assert(`missing param for ${routeMsg}: ${e.message}`)
    return ''
  }
}

function resolveRecordPath (path: string, record: RouteRecord): string {
  return resolvePath(path, record.parent ? record.parent.path : '/', true)
}

function getFullPath ({ path = '/', query = {}, hash = '' }) {
  return path + stringifyQuery(query) + hash
}
