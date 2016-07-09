export function createRouteMap (routes) {
  const pathMap = Object.create(null)
  const nameMap = Object.create(null)

  routes.forEach(route => {
    addRoute(pathMap, nameMap, route)
  })

  return {
    pathMap,
    nameMap
  }
}

function addRoute (pathMap, nameMap, route, parent) {
  const {
    path,
    name,
    component,
    components,
    children,
    onEnter,
    onLeave
  } = route

  const record = {
    path: normalizePath(path, parent),
    components: components || { default: component },
    parent,
    onEnter,
    onLeave
  }

  if (children) {
    children.forEach(child => {
      addRoute(pathMap, nameMap, child, record)
    })
  }

  pathMap[record.path] = record
  if (name) nameMap[name] = record
}

function normalizePath (path, parent) {
  if (path[0] == '/') return path  // "/" signifies an absolute route
  if (parent == null) return path  // no need for a join
  return `${parent.path}/${path}`.replace(/\/\//g, '/') // join
}
