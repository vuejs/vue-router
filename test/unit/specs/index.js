window.isIE9 = navigator.userAgent.toLowerCase().indexOf('msie 9.0') > 0
window.wait = 16

require('es6-promise').polyfill()

var Vue = require('vue')
var Router = require('../../../src')
Vue.use(Router)

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
