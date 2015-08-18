import { warn } from './util'
import Router from './router'

/**
 * Installation interface.
 * Install the necessary directives.
 */

Router.install = function (Vue) {
  /* istanbul ignore if */
  if (Router.installed) {
    warn('already installed.')
    return
  }
  require('./router/api')(Vue, Router)
  require('./router/internal')(Vue, Router)
  require('./directives/view')(Vue)
  require('./directives/link')(Vue)
  require('./override')(Vue)
  Router.Vue = Vue
  Router.installed = true
}

// auto install
/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(Router)
}

export default Router
