window.isIE9 = navigator.userAgent.toLowerCase().indexOf('msie 9.0') > 0

require('es6-promise').polyfill()

var Vue = require('vue')
var Router = require('../../../src')
Vue.use(Router)

require('./core.spec.js')
require('./pipeline.spec.js')
require('./hash-history.spec.js')
require('./html5-history.spec.js')
