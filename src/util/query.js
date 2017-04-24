/* @flow */

import { warn } from './warn'
import qs from 'qs'

const encodeReserveRE = /[!'()*]/g
const encodeReserveReplacer = c => '%' + c.charCodeAt(0).toString(16)
const commaRE = /%2C/g

// fixed encodeURIComponent which is more conformant to RFC3986:
// - escapes [!'()*]
// - preserve commas
const encode = str => encodeURIComponent(str)
  .replace(encodeReserveRE, encodeReserveReplacer)
  .replace(commaRE, ',')

export function resolveQuery (
  query: ?string,
  extraQuery: Dictionary<string> = {},
  _parseQuery: ?Function
): Dictionary<string> {
  const parse = _parseQuery || parseQuery
  let parsedQuery
  try {
    parsedQuery = parse(query || '')
  } catch (e) {
    process.env.NODE_ENV !== 'production' && warn(false, e.message)
    parsedQuery = {}
  }
  for (const key in extraQuery) {
    const val = extraQuery[key]
    parsedQuery[key] = Array.isArray(val) ? val.slice() : val
  }
  return parsedQuery
}

export function parseQuery (query: string): Dictionary<string> {
  const res = qs.parse(query)
  return res
}

export function stringifyQuery (obj: Dictionary<string>): string {
  const res = obj ? qs.stringify(obj, { indices: false, encoder: function (str) {
    return encode(str)
  } }) : null
  return res ? `?${res}` : ''
}
