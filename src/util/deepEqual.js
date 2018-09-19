const hasOwn = Object.prototype.hasOwnProperty

function is (x, y) {
  if (x === y) {
    // is(-0, +0) === false
    return x !== 0 || y !== 0 || 1 / x === 1 / y
  } else {
    /* eslint-disable no-self-compare */
    return x !== x && y !== y // is(NaN, NaN) === true
    /* eslint-enable no-self-compare */
  }
}

// deep equal, with guard against circular references
const guardedDeepEqual = (objA, objB, bufferA, bufferB) => {
  if (is(objA, objB)) return true

  if (
    typeof objA !== 'object' ||
    objA === null ||
    typeof objB !== 'object' ||
    objB === null
  ) {
    return false
  }
  const seenA = bufferA.indexOf(objA) !== -1
  const seenB = bufferB.indexOf(objB) !== -1

  if (seenA || seenB) return seenA && seenB

  bufferA.push(objA)
  bufferB.push(objB)

  const keysA = Object.keys(objA)
  const keysB = Object.keys(objB)

  if (keysA.length !== keysB.length) return false

  for (let i = 0; i < keysA.length; i += 1) {
    if (!hasOwn.call(objB, keysA[i])) return false
    const valA = objA[keysA[i]]
    const valB = objB[keysA[i]]
    if (
      typeof valA === 'object' &&
      valA &&
      typeof valB === 'object' &&
      valB &&
      !guardedDeepEqual(valA, valB, bufferA, bufferB)
    ) {
      return false
    } else if (!is(valA, valB)) {
      return false
    }
  }

  return true
}

export default (objA, objB) => guardedDeepEqual(objA, objB, [], [])
