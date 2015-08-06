var RouteTransition = require('./transition')
var getRouteConfig = require('../../util').getRouteConfig

// install the <router-view> element directive
module.exports = function (Vue) {

  var _ = Vue.util
  var component = Vue.directive('_component')

  // v-view extends v-component
  var viewDef = _.extend({}, component)

  // with some overrides
  _.extend(viewDef, {

    _isRouterView: true,

    bind: function () {
      // react to route change
      this.currentRoute = null
      this.currentComponentId = null
      this.unwatch = this.vm.$watch(
        'route',
        _.bind(this.onRouteChange, this),
        // important as this makes the watcher execute
        // in the internal queue instead of the user queue,
        // so that the callback fires before the view is
        // affected by the route change.
        { user: false }
      )
      // force dynamic directive so v-component doesn't
      // attempt to build right now
      this._isDynamicLiteral = true
      // finally, init by delegating to v-component
      component.bind.call(this)
      // initial render
      if (this.vm.route) {
        this.onRouteChange(this.vm.route, {})
      }
    },

    /*
     * Route change handler.
     *
     * A router view transition happens in the following
     * order, assuming we are transitioning from
     * component A => component B:
     *
     * 1. check A.canDeactivate
     * 2. check B.canActivate
     * 3. call A.decactivate
     * 4. call B.activate
     *
     * Each of these steps can be asynchronous, and any
     * step can potentially abort the transition.
     *
     * @param {Route} route
     * @param {Route} previousRoute
     */

    onRouteChange: function (route, previousRoute) {
      var transition = new RouteTransition(route, previousRoute)

      // determine reusability
      var fromComponent = this.childVM
      var toComponentID = transition.resolveComponentID(this.vm)

      function canReuse () {
        var canReuseFn = getRouteConfig(fromComponent, 'canReuse')
        return typeof canReuseFn === 'boolean'
          ? canReuseFn
          : canReuseFn
            ? canReuseFn.call(fromComponent, transition)
            : true // defaults to true
      }

      if (toComponentID === this._routeComponentID && canReuse()) {
        // can reuse, just re-activate
        transition._canReuse = true
        transition._Component = this.Ctor || this.Component
        this.activate(transition)
      } else {
        // cannot reuse, start the full transition pipeline
        this.canDeactivate(transition)
      }
    },

    canDeactivate: require('./can-deactivate'),
    canActivate: require('./can-activate'),
    deactivate: require('./deactivate'),
    activate: require('./activate'),

    unbind: function () {
      this.unwatch()
      component.unbind.call(this)
    }
  })

  Vue.elementDirective('router-view', viewDef)
}
