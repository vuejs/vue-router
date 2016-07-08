import Regexp from 'path-to-regexp'
import { extractQuery } from './query'

export function createMatcher (routes) {
  const map = {}
  routes.forEach(r => addRoute(map, r))

  return function match (fullPath) {
    const { path, query } = extractQuery(fullPath)
    const params = {}
    for (const route in map) {
      if (matchRoute(route, params, path)) {
        return Object.freeze({
          params,
          query,
          matched: formatMatch(map[route])
        })
      }
    }
  }
}

function addRoute (map, route, parent) {
  const { path, component, components, meta, children } = route
  const record = {
    path: normalizeRoute(path, parent),
    components: components || { default: component },
    parent,
    meta
  }
  if (children) {
    children.forEach(child => addRoute(map, child, record))
  }
  map[record.path] = record
}

function normalizeRoute (path, parent) {
  if (path[0] == '/') return path  // "/" signifies an absolute route
  if (parent == null) return path  // no need for a join
  return `${parent.path}/${path}`.replace(/\/\//g, '/') // join
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

  for (var i = 1, len = m.length; i < len; ++i) {
    var key = keys[i - 1]
    var val = 'string' == typeof m[i] ? decodeURIComponent(m[i]) : m[i]
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
