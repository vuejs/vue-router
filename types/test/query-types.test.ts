import VueRouter from '../index'
import { Route } from '../index'

const router = new VueRouter()
const route: Route = router.currentRoute

const stringQuery: string | null | (string | null)[] = route.query['stringParam']
if (typeof stringQuery === 'string') {
  console.log(stringQuery.toLowerCase())
}

const nullQuery: string | null | (string | null)[] = route.query['paramWithoutValue']
if (nullQuery === null) {
  console.log('Parameter exists but has no value')
}

const arrayQuery: string | null | (string | null)[] = route.query['arrayParam']
if (Array.isArray(arrayQuery)) {
  arrayQuery.forEach(value => {
    if (value === null) {
      console.log('Array contains null value')
    } else {
      console.log(value.toLowerCase())
    }
  })
}

router.push({
  path: '/test',
  query: {
    string: 'value',              // string value
    empty: null,                  // null value
    array: ['value1', 'value2'],  // array of strings
    mixedArray: ['value', null],  // array with null
    noValue: null                 // parameter without value
  }
})

const routeWithQueries: Route = {
  path: '/test',
  name: null,
  hash: '',
  query: {
    param1: 'string',            // string value
    param2: null,               // null value
    param3: ['val1', 'val2'],   // array of strings
    param4: ['val', null],      // array with null
    param5: null                // parameter without value
  },
  params: {},
  fullPath: '/test',
  matched: []
}
