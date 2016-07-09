const encode = encodeURIComponent
const decode = decodeURIComponent

export function resolveQuery (path, extraQuery = {}) {
  const index = path.indexOf('?')
  if (index > 0) {
    let query = path.slice(index + 1)
    try {
      query = parseQuery(query)
    } catch (e) {
      console.error(e)
      query = {}
    }
    for (const key in extraQuery) {
      query[key] = extraQuery[key]
    }
    return {
      path: path.slice(0, index),
      query
    }
  } else {
    return {
      path,
      query: extraQuery
    }
  }
}

function parseQuery (query) {
  const res = Object.create(null)

  query = query.trim().replace(/^(\?|#|&)/, '')

  if (!query) {
    return res
  }

  query.split('&').forEach(param => {
    const parts = param.replace(/\+/g, ' ').split('=')
    const key = decode(parts.shift())
    const val = parts.length > 0
      ? decode(parts.join('='))
      : null

    if (res[key] === undefined) {
      res[key] = val
    } else if (Array.isArray(res[key])) {
      res[key].push(val)
    } else {
      res[key] = [res[key], val]
    }
  })

  return res
}

export function stringifyQuery (obj) {
  const res = obj ? Object.keys(obj).sort().map(key => {
    const val = obj[key]

    if (val === undefined) {
      return ''
    }

    if (val === null) {
      return encode(key)
    }

    if (Array.isArray(val)) {
      const result = []
      val.slice().forEach(val2 => {
        if (val2 === undefined) {
          return
        }
        if (val2 === null) {
          result.push(encode(key))
        } else {
          result.push(encode(key) + '=' + encode(val2))
        }
      })
      return result.join('&')
    }

    return encode(key) + '=' + encode(val)
  }).filter(x => x.length > 0).join('&') : null
  return res ? `?${res}` : ''
}
