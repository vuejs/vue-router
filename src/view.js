// install the <router-view> element directive

module.exports = function (Vue) {

  // insert global css to make sure router-view has
  // display:block so that transitions work properly
  require('insert-css')('router-view{display:block;}')

  var _ = Vue.util
  var component = Vue.directive('_component')
  var templateParser = Vue.parsers.template

  // v-view extends v-component
  var viewDef = _.extend({}, component)

  // with some overrides
  _.extend(viewDef, {

    _isRouterView: true,

    bind: function () {
      // react to route change
      this.currentRoute = null
      this.currentComponentId = null
      this.onRouteChange = _.bind(this.onRouteChange, this)
      this.unwatch = this.vm.$watch('route', this.onRouteChange)
      // force dynamic directive so v-component doesn't
      // attempt to build right now
      this._isDynamicLiteral = true
      // finally, init by delegating to v-component
      component.bind.call(this)
      if (this.vm.route) {
        this.onRouteChange(this.vm.route)
      }
    },

    onRouteChange: function (route) {
      var previousRoute = this.currentRoute
      this.currentRoute = route

      if (!route._matched) {
        // route not found, this outlet is invalidated
        return this.invalidate()
      }

      var segment = route._matched[route._matchedCount]
      if (!segment) {
        // no segment that matches this outlet
        return this.invalidate()
      }

      // mutate the route as we pass it further down the
      // chain. this series of mutation is done exactly once
      // for every route as we match the components to render.
      route._matchedCount++

      // trigger component switch
      var handler = segment.handler
      if (handler.component !== this.currentComponentId ||
          handler.alwaysRefresh) {

        // call before hook
        if (handler.before) {
          var beforeResult = handler.before(route, previousRoute)
          if (beforeResult === false) {
            if (route._router._hasPushState) {
              history.back()
            } else if (previousRoute) {
              route._router.replace(previousRoute.path)
            }
            return
          }
        }

        this.currentComponentId = handler.component

        // call data hook
        if (handler.data) {
          if (handler.waitOnData) {
            handler.data(route, _.bind(function (data) {
              // actually switch component
              this.setComponent(handler.component, data, null, after)
            }, this), onDataError)
          } else {
            route.loading = true
            // async data loading with possible race condition.
            // the data may load before the component gets
            // rendered (due to async components), or it could
            // be the other way around.
            var _data, _component
            handler.data(route, function (data) {
              if (_component) {
                setData(_component, data)
              } else {
                _data = data
              }
            }, onDataError)
            this.setComponent(handler.component, null, function (component) {
              if (_data) {
                setData(component, _data)
              } else {
                _component = component
              }
            }, after)
          }
        } else {
          // no data hook, just set component
          this.setComponent(handler.component, null, null, after)
        }

        function setData (vm, data) {
          for (var key in data) {
            vm.$set(key, data[key])
          }
          route.loading = false
        }

        function after () {
          // call after hook
          if (handler.after) {
            handler.after(route, previousRoute)
          }
        }

        function onDataError (err) {
          console.warn(
            'vue-router failed to load data for route: ' +
            route.path
          )
          if (err) {
            console.warn(err)
          }
        }
      }
    },

    invalidate: function () {
      this.currentComponentId = null
      this.setComponent(null)
    },

    unbind: function () {
      this.unwatch()
      component.unbind.call(this)
    }

  })

  Vue.elementDirective('router-view', viewDef)
}
