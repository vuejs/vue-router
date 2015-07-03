var routerUtil = require('./util')

// install the <router-view> element directive
module.exports = function (Vue) {

  // insert global css to make sure router-view has
  // display:block so that transitions work properly
  require('insert-css')('router-view{display:block;}')

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
        this.onRouteChange(this.vm.route)
      }
    },

    /**
     * Route change handler. Check match, segment and before
     * hook to determine whether this view should be
     * rendered or switched.
     *
     * @param {Route} route
     */

    onRouteChange: function (route) {
      var self = this
      var previousRoute = this.currentRoute
      this.currentRoute = route

      if (!route._matched) {
        // route not found, this outlet is invalidated
        return this.invalidate()
      }

      // determine handler
      var handler
      var depth = getViewDepth(this.vm)
      var segment = route._matched[depth]
      if (!segment) {
        // check if the parent view has a default child view
        var parent = route._matched[depth - 1]
        if (parent && parent.handler.defaultChildHandler) {
          handler = parent.handler.defaultChildHandler
        } else {
          // no segment that matches this outlet
          return this.invalidate()
        }
      } else {
        handler = segment.handler
      }

      // trigger component switch
      var prevPath = previousRoute && previousRoute.path
      if (route.path !== prevPath) {
        // call before hook
        if (handler.before) {
          routerUtil.callAsyncFn(handler.before, {
            args: [route, previousRoute],
            onResolve: transition,
            onReject: reject
          })
        } else {
          transition()
        }
      }

      function transition () {
        self.switchView(route, previousRoute, handler)
      }

      function reject () {
        var path = previousRoute
          ? previousRoute.path
          : '/'
        route._router.replace(path)
      }
    },

    /**
     * Transition from a previous route to a new route.
     * Handles the async data loading logic, then delegates
     * to the component directive's setComponent method.
     *
     * @param {Route} route
     * @param {Route} previousRoute
     * @param {RouteHandler} handler
     */

    switchView: function (route, previousRoute, handler) {
      var self = this
      var symbol = this.transitionSymbol = {}

      // The component may have been switched before async
      // callbacks are called. Make sure the callbacks only
      // execute when the current directive instance is still
      // active and current transition is still valid.
      function onlyWhenValid (fn) {
        return function () {
          if (self.vm && self.transitionSymbol === symbol) {
            fn.apply(this, arguments)
          }
        }
      }

      var mount = onlyWhenValid(function (data) {
        self.setComponent(handler.component, data, null, afterTransition)
      })

      var afterTransition = onlyWhenValid(function () {
        if (handler.after) {
          handler.after(route, previousRoute)
        }
      })

      var setData = onlyWhenValid(function (vm, data) {
        for (var key in data) {
          vm.$set(key, data[key])
        }
        vm.loading = false
      })

      function warnDataError () {
        routerUtil.warn(
          'failed to load data for route: ' +
          route.path, err
        )
      }

      // the error handler doesn't need to cancel.
      function onDataError (err) {
        warnDataError()
        mount()
      }

      // if we are switching into the same component as the
      // existing one, we only need to update the data and
      // call after hook.
      if (
        this.childVM &&
        !handler.alwaysRefresh &&
        handler.component === this.currentComponentId
      ) {
        if (handler.data) {
          var vm = this.childVM
          vm.loading = true
          routerUtil.callAsyncFn(handler.data, {
            args: [route],
            onResolve: function (data) {
              setData(vm, data)
              vm.loading = false
              if (handler.waitOnData) {
                afterTransition()
              }
            },
            onReject: warnDataError
          })
          if (!handler.waitOnData) {
            afterTransition()
          }
        } else {
          afterTransition()
        }
        return
      }

      // switching into a new component.
      this.currentComponentId = handler.component

      // call data hook
      if (handler.data) {
        if (handler.waitOnData) {
          routerUtil.callAsyncFn(handler.data, {
            args: [route],
            onResolve: mount,
            onReject: onDataError
          })
        } else {
          // async data loading with possible race condition.
          // the data may load before the component gets
          // rendered (due to async components), or it could
          // be the other way around.
          var _data, _vm
          // send out data request...
          routerUtil.callAsyncFn(handler.data, {
            args: [route],
            onResolve: function (data) {
              if (_vm) {
                setData(_vm, data)
              } else {
                _data = data
              }
            },
            onReject: onDataError
          })
          // start the component switch...
          this.setComponent(handler.component, { loading: true }, function (vm) {
            if (_data) {
              setData(vm, _data)
            } else {
              _vm = vm
            }
          }, afterTransition)
        }
      } else {
        // no data hook, just set component
        mount()
      }
    },

    /**
     * Clears the unmatched view.
     */

    invalidate: function () {
      this.currentRoute =
      this.currentComponentId =
      this.transitionSymbol = null
      this.setComponent(null)
    },

    unbind: function () {
      this.unwatch()
      component.unbind.call(this)
    }

  })

  Vue.elementDirective('router-view', viewDef)

  //
  // Helpers
  //

  /**
   * Checked nested view depth of the current view.
   *
   * @param {Vue} vm
   * @return {Number}
   */

  function getViewDepth (vm) {
    var depth = 0
    while (vm.$parent) {
      if (vm.$options._isRouterView) {
        depth++
      }
      vm = vm.$parent
    }
    return depth
  }
}
