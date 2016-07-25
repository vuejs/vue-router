/* @flow */

import { assert } from './util/warn'
import { cleanPath } from './util/path'

export function createRouteMap (routes: Array<RouteConfig>): {
  pathMap: RouteMap,
  nameMap: RouteMap
} {
  const pathMap: RouteMap = Object.create(null)
  const nameMap: RouteMap = Object.create(null)

  routes.forEach(route => {
    addRouteRecord(pathMap, nameMap, route)
  })

  return {
    pathMap,
    nameMap
  }
}

function addRouteRecord (
  pathMap: RouteMap,
  nameMap: RouteMap,
  route: RouteConfig,
  parent?: RouteRecord,
  matchAs?: string
) {
  const { path, name } = route
  assert(path != null, `"path" is required in a route configuration.`)

  const record: RouteRecord = {
    path: normalizePath(path, parent),
    components: route.components || { default: route.component },
    instances: {},
    name,
    parent,
    matchAs,
    redirect: route.redirect,
    beforeEnter: route.beforeEnter,
    meta: route.meta || {}
  }

  if (route.children) {
    route.children.forEach(child => {
      addRouteRecord(pathMap, nameMap, child, record)
    })
  }

  if (route.alias) {
    if (Array.isArray(route.alias)) {
      route.alias.forEach(alias => {
        addRouteRecord(pathMap, nameMap, { path: alias }, parent, record.path)
      })
    } else {
      addRouteRecord(pathMap, nameMap, { path: route.alias }, parent, record.path)
    }
  }

  pathMap[record.path] = record
  if (name) nameMap[name] = record
}

function normalizePath (path: string, parent?: RouteRecord): string {
  path = path.replace(/\/$/, '')
  if (path[0] === '/') return path
  if (parent == null) return path
  return cleanPath(`${parent.path}/${path}`)
}
