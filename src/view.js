// install the v-view directive

module.exports = function (Vue) {

  var _ = Vue.util
  var component = Vue.directive('component')
  var templateParser = Vue.parsers.template

  // v-view extends v-component
  var viewDef = _.extend({}, component)

  // with some overrides
  _.extend(viewDef, {

    bind: function () {
      // implicitly pass down route context
      // using v-with
      this.el.setAttribute(
        Vue.config.prefix + 'with',
        'routeContext:routeContext'
      )
      // set currentView ref
      this.el.setAttribute(
        Vue.config.prefix + 'ref',
        'currentView'
      )
      // force dynamic directive
      this._isDynamicLiteral = true
      // react to route change
      this.currentContext = null
      this.currentRoute = null
      this.currentComponentId = null
      this.onRouteChange = _.bind(this.onRouteChange, this)
      this.unwatch = this.vm.$watch('routeContext', this.onRouteChange)
      // finally, init by delegating to v-component
      component.bind.call(this)
      if (this.vm.routeContext) {
        this.onRouteChange(this.vm.routeContext)
      }
    },

    onRouteChange: function (context) {
      this.currentContext = context
      if (!context._matched) {
        // route not found, this outlet is invalidated
        return this.invalidate()
      }
      var route = this.currentRoute =
        context._matched[context._matchedCount]
      if (!route) {
        // no sub-route that matches this outlet
        return this.invalidate()
      }
      // mutate the context as we pass it further down the
      // chain. this series of mutation is done exactly once
      // for every context as we match the components to render.
      context._matchedCount++
      // trigger component switch
      if (route.handler.component !== this.currentComponentId ||
          route.handler.alwaysRefresh) {
        // TODO: handle before/after hooks
        this.currentComponentId = route.handler.component
        this.update(route.handler.component)
      } else if (this.childVM) {
        // possible params change
        this.childVM.route.path = context._path
        this.childVM.route.query = context._matched.queryParams
        this.childVM.route.params = route.params
      }
    },

    invalidate: function () {
      this.currentComponentId = null
      this.currentRoute = null
      this.update(null)
    },

    build: function () {
      var context = this.currentContext
      var route = this.currentRoute
      if (this.keepAlive) {
        var cached = this.cache[this.ctorId]
        if (cached) {
          cached.route.path = context._path
          cached.route.query = context._matched.queryParams
          cached.route.params = route.params
          return cached
        }
      }
      var vm = this.vm
      var el = templateParser.clone(this.el)
      if (this.Ctor) {
        var child = vm.$addChild({
          el: el,
          template: this.template,
          _asComponent: true,
          _host: this._host,
          data: {
            routeContext: null,
            route: {
              path: context._path,
              query: context._matched.queryParams,
              params: route.params
            }
          }
        }, this.Ctor)
        if (this.keepAlive) {
          this.cache[this.ctorId] = child
        }
        return child
      }
    },

    unbind: function () {
      this.unwatch()
    }

  })

  Vue.directive('view', viewDef)
}