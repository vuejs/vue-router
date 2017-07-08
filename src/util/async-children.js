/* @flow */

export function findParent(
  routeRecord: RouteRecord
): RouteRecord {
  if (routeRecord.parent) {
    return findParent(routeRecord.parent)
  } else {
    return routeRecord
  }
}

export function loadDefaultAsyncChildren(
  childrenConfigs: Array<RouteConfig>
): Promise<RouteConfig[]> {
  return Promise.all([
    ...childrenConfigs.map(child => {
      if (child.path === '' && typeof child.loadChildren === 'function') {
        return child.loadChildren()
          .then(asyncChildren =>
            loadDefaultAsyncChildren(asyncChildren)
          )
          .then(asyncChildren => {
            child.loadChildren = null

            if (child.children) {
              child.children.push(...asyncChildren)
            } else {
              child.children = asyncChildren
            }

            return child
          })
      } else {
        return child
      }
    })
  ])
}

export function addChildren(
  routeConfig: RouteConfig,
  children: RouteConfig[],
  childRoutePath: string,
  location: string
): Promise<RouteConfig> {
  let updatedPath = childRoutePath.replace(/^\//, '')
  let configPath = routeConfig.path.replace(/^\//, '')
  let updatedLocation = location.replace(/^\//, '').replace(configPath, '')

  if (updatedPath === configPath) {
    routeConfig.loadChildren = null
    if (routeConfig.children) {
      routeConfig.children.push(...children)
    } else {
      routeConfig.children = children
    }

    if (updatedLocation === '') {
      // User attempting to load default path
      return loadDefaultAsyncChildren(routeConfig.children || [])
        .then(asyncChildren => {
          routeConfig.children = asyncChildren
          return routeConfig
        })
    } else {
      return Promise.resolve(routeConfig)
    }
  } else if (updatedPath.indexOf(configPath) === 0) {
    updatedPath = updatedPath.replace(configPath, '')

    return Promise.all([
      ...(routeConfig.children || []).map(child =>
        addChildren(child, children, updatedPath, location)
      )
    ])
      .then(children => {
        routeConfig.children = children
        return routeConfig
      })
  } else {
    return Promise.resolve(routeConfig)
  }
}