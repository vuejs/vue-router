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
    addRoute(pathMap, nameMap, route)
  })

  return {
    pathMap,
    nameMap
  }
}

function addRoute (
  pathMap: RouteMap,
  nameMap: RouteMap,
  route: RouteConfig,
  parent?: RouteRecord
) {
  const { path, name } = route
  assert(path != null, `"path" is required in a route configuration.`)

  const record: RouteRecord = {
    path: parent ? cleanPath(`${parent.path}/${path}`) : path,
    components: route.components || { default: route.component },
    instances: {},
    name,
    parent,
    alias: route.alias,
    redirect: route.redirect,
    canActivate: route.canActivate,
    canDeactivate: route.canDeactivate
  }

  console.log(record)

  if (route.children) {
    route.children.forEach(child => {
      addRoute(pathMap, nameMap, child, record)
    })
  }

  pathMap[record.path] = record
  if (name) nameMap[name] = record
}
