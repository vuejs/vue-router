/* @flow */

export function isSameRoute (a: Route, b: ?Route): boolean {
  if (!b) {
    return false
  } else if (a.path && b.path) {
    return (
      a.path === b.path &&
      a.hash === b.hash &&
      isObjectEqual(a.query, b.query)
    )
  } else if (a.name && b.name) {
    return (
      a.name === b.name &&
      a.hash === b.hash &&
      isObjectEqual(a.query, b.query) &&
      isObjectEqual(a.params, b.params)
    )
  } else {
    return false
  }
}

function isObjectEqual (a = {}, b = {}): boolean {
  const aKeys = Object.keys(a)
  const bKeys = Object.keys(b)
  if (aKeys.length !== bKeys.length) {
    return false
  }
  return aKeys.every(key => String(a[key]) === String(b[key]))
}

export function isIncludedRoute (current: Route, target: Route): boolean {
  return (
    current.path.indexOf(target.path) === 0 &&
    (!target.hash || current.hash === target.hash) &&
    queryIncludes(current.query, target.query)
  )
}

function queryIncludes (current: StringHash, target: StringHash): boolean {
  for (const key in target) {
    if (!(key in current)) {
      return false
    }
  }
  return true
}
