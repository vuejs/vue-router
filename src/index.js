import { warn } from './util'
import Router from './router'

import RouterApi from './router/api'
import RouterInternal from './router/internal'
import View from './directives/view'
import Link from './directives/link'
import Override from './override'

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
  RouterApi(Vue, Router)
  RouterInternal(Vue, Router)
  View(Vue)
  Link(Vue)
  Override(Vue)
  Router.Vue = Vue
  Router.installed = true
}

// auto install
/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(Router)
}

export default Router
