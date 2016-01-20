import { warn } from '../util'
import { activate } from '../pipeline'

export default function (Vue) {

  const _ = Vue.util
  const componentDef =
    // 0.12
    Vue.directive('_component') ||
    // 1.0
    Vue.internalDirectives.component
  // <router-view> extends the internal component directive
  const viewDef = _.extend({}, componentDef)

  // with some overrides
  _.extend(viewDef, {

    _isRouterView: true,

    bind () {
      const route = this.vm.$route
      /* istanbul ignore if */
      if (!route) {
        warn(
          '<router-view> can only be used inside a ' +
          'router-enabled app.'
        )
        return
      }
      // force dynamic directive so v-component doesn't
      // attempt to build right now
      this._isDynamicLiteral = true
      // finally, init by delegating to v-component
      componentDef.bind.call(this)

      // locate the parent view
      let parentView
      let parent = this.vm
      while (parent) {
        if (parent._routerView) {
          parentView = parent._routerView
          break
        }
        parent = parent.$parent
      }
      if (parentView) {
        // register self as a child of the parent view,
        // instead of activating now. This is so that the
        // child's activate hook is called after the
        // parent's has resolved.
        this.parentView = parentView
        parentView.childView = this
      } else {
        // this is the root view!
        const router = route.router
        router._rootView = this
      }

      // handle late-rendered view
      // two possibilities:
      // 1. root view rendered after transition has been
      //    validated;
      // 2. child view rendered after parent view has been
      //    activated.
      var transition = route.router._currentTransition
      if ((!parentView && transition.done) ||
          (parentView && parentView.activated)) {
        var depth = parentView ? parentView.depth + 1 : 0
        activate(this, transition, depth)
      }
    },

    unbind () {
      if (this.parentView) {
        this.parentView.childView = null
      }
      componentDef.unbind.call(this)
    }
  })

  Vue.elementDirective('router-view', viewDef)
}
