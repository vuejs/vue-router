import { warn } from '../util'

export default function (Vue) {

  let _ = Vue.util
  let componentDef = Vue.directive('_component')
  // <router-view> extends the internal component directive
  let viewDef = _.extend({}, componentDef)

  // with some overrides
  _.extend(viewDef, {

    _isRouterView: true,

    bind: function () {
      let route = this.vm.$route
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
      // does not support keep-alive.
      /* istanbul ignore if */
      if (this.keepAlive) {
        this.keepAlive = false
        warn('<router-view> does not support keep-alive.')
      }

      // all we need to do here is registering this view
      // in the router. actual component switching will be
      // managed by the pipeline.
      let router = this.router = route._router
      router._views.unshift(this)

      // note the views are in reverse order.
      let parentView = router._views[1]
      if (parentView) {
        // register self as a child of the parent view,
        // instead of activating now. This is so that the
        // child's activate hook is called after the
        // parent's has resolved.
        parentView.childView = this
      }
    },

    unbind: function () {
      this.router._views.$remove(this)
      componentDef.unbind.call(this)
    }
  })

  Vue.elementDirective('router-view', viewDef)
}
