var UA = navigator.userAgent.toLowerCase()
window.isIE9 = UA.indexOf('msie 9.0') > 0
window.isIE = UA.indexOf('trident') > 0

// IE has some shaky timer precision issues when using the Promise polyfill...
window.wait = isIE ? 100 : 30

require('es6-promise').polyfill()

var Vue = require('vue')
var Router = require('../../../src')
Vue.use(Router)

require('./util')
require('./core')

describe('Pipeline', function () {
  require('./pipeline/full')
  require('./pipeline/activate')
  require('./pipeline/deactivate')
  require('./pipeline/can-activate')
  require('./pipeline/can-deactivate')
  require('./pipeline/can-reuse')
  require('./pipeline/data')
})

describe('History', function () {
  require('./history/hash')
  require('./history/html5')
})
