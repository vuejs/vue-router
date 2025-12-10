import VueRouter from '../index'
import { Route } from '../index'

const component = { template: '<div>test</div>' }

const router = new VueRouter({
  routes: [
    { path: '/:id', component }
  ]
})

describe('Route query types', () => {
  it('should handle string query parameter', () => {
    const route: Route = {
      path: '/test',
      query: { foo: 'bar' },
      params: {},
      fullPath: '/test?foo=bar',
      name: null,
      hash: '',
      matched: [],
      redirectedFrom: undefined,
      meta: {}
    }
    
    expect(typeof route.query.foo).toBe('string')
  })

  it('should handle null query parameter', () => {
    const route: Route = {
      path: '/test',
      query: { foo: null },
      params: {},
      fullPath: '/test?foo',
      name: null,
      hash: '',
      matched: [],
      redirectedFrom: undefined,
      meta: {}
    }
    
    expect(route.query.foo).toBeNull()
  })

  it('should handle array of strings query parameter', () => {
    const route: Route = {
      path: '/test',
      query: { foo: ['bar', 'baz'] },
      params: {},
      fullPath: '/test?foo=bar&foo=baz',
      name: null,
      hash: '',
      matched: [],
      redirectedFrom: undefined,
      meta: {}
    }
    
    expect(Array.isArray(route.query.foo)).toBe(true)
    expect(route.query.foo).toEqual(['bar', 'baz'])
  })

  it('should handle array with null query parameter', () => {
    const route: Route = {
      path: '/test',
      query: { foo: ['bar', null] },
      params: {},
      fullPath: '/test?foo=bar&foo',
      name: null,
      hash: '',
      matched: [],
      redirectedFrom: undefined,
      meta: {}
    }
    
    expect(Array.isArray(route.query.foo)).toBe(true)
    expect(route.query.foo).toEqual(['bar', null])
  })

  it('should handle mixed query parameters', () => {
    const route: Route = {
      path: '/test',
      query: { 
        string: 'value',
        nullValue: null,
        stringArray: ['one', 'two'],
        mixedArray: ['three', null]
      },
      params: {},
      fullPath: '/test?string=value&nullValue&stringArray=one&stringArray=two&mixedArray=three&mixedArray',
      name: null,
      hash: '',
      matched: [],
      redirectedFrom: undefined,
      meta: {}
    }
    
    expect(typeof route.query.string).toBe('string')
    expect(route.query.nullValue).toBeNull()
    expect(Array.isArray(route.query.stringArray)).toBe(true)
    expect(Array.isArray(route.query.mixedArray)).toBe(true)
    expect(route.query.mixedArray).toEqual(['three', null])
  })
})
