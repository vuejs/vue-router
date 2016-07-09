import { resolveQuery } from './query'

export function normalizeLocation (next, current) {
  if (typeof next === 'string') {
    next = {
      path: next
    }
  }

  if (!next.name) {
    return resolveQuery(resolvePath(
      next.path || '',
      current && current.path,
      next.append
    ), next.query)
  } else {
    return next
  }
}

export function isSameLocation (a, b) {
  if (!b) {
    return false
  } else if (a.path && b.path) {
    return (
      a.path === b.path &&
      isObjectEqual(a.query, b.query)
    )
  } else if (a.name && b.name) {
    return (
      a.name === b.name &&
      isObjectEqual(a.query, b.query) &&
      isObjectEqual(a.params, b.params)
    )
  } else {
    return false
  }
}

function resolvePath (relative, base, append) {
  if (relative.charAt(0) === '/') {
    return relative
  }

  if (relative.charAt(0) === '?') {
    return base + relative
  }

  const stack = base.split('/')

  // remove trailing segment if:
  // - not appending
  // - appending to trailing slash (last segment is empty)
  if (!append || !stack[stack.length - 1]) {
    stack.pop()
  }

  // resolve relative path
  const segments = relative.replace(/^\//, '').split('/')
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i]
    if (segment === '.') {
      continue
    } else if (segment === '..') {
      stack.pop()
    } else {
      stack.push(segment)
    }
  }

  // ensure leading slash
  if (stack[0] !== '') {
    stack.unshift('')
  }

  return stack.join('/')
}

function isObjectEqual (a = {}, b = {}) {
  const aKeys = Object.keys(a)
  const bKeys = Object.keys(b)
  if (aKeys.length !== bKeys.length) {
    return false
  }
  return aKeys.every(key => String(a[key]) === String(b[key]))
}
