import { extractQuery } from './query'

export function createLocationUtil ({ pathMap, nameMap }) {
  return {
    normalizeLocation (nextLocation, currentLocation = {}) {
      if (typeof nextLocation === 'string') {
        nextLocation = {
          path: nextLocation
        }
      }

      if (!nextLocation.name) {
        return extractQuery(resolvePath(
          nextLocation.path,
          currentLocation.path,
          nextLocation.append
        ))
      } else {
        return nextLocation
      }
    },

    isSameLocation (a, b) {
      return a.path === (b && b.path)
    }
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
    let segment = segments[i]
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
