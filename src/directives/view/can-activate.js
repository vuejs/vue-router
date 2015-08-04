var routerUtil = require('../../util')

module.exports = function (transition) {
  var to = transition.to
  if (to._aborted) {
    return
  }
  var self = this
  var abort = transition.abort
  var next = transition.next = function () {
    self._componentID = transition._componentID
    self.deactivate(transition)
  }

  // route not found
  if (!to._matched) {
    return next()
  }

  // determine handler
  var depth = getViewDepth(this.vm)
  var segment = to._matched[depth]
  if (!segment) {
    // check if the parent view has a default child view
    var parent = to._matched[depth - 1]
    if (parent && parent.handler.defaultChildHandler) {
      transition._componentID = parent.handler.defaultChildHandler.component
    } else {
      // no segment that matches this outlet
      return next()
    }
  } else {
    transition._componentID = segment.handler.component
  }

  // resolve async component.
  // compat <= 0.12.8
  var resolver = this.resolveCtor || this.resolveComponent
  resolver.call(
    this,
    transition._componentID,
    function onComponentResolved () {
      var Component =
        transition._Component =
        // compat <= 0.12.8
        self.Ctor || self.Component

      // if it's the same component, do nothing unless
      // the 'reload' route config is set to true.
      if (
        transition._componentID === self._componentID &&
        !routerUtil.getRouteConfig(Component, 'reload')
      ) {
        return
      }

      // determine if this component can be activated
      var hook = routerUtil.getRouteConfig(Component, 'canActivate')
      if (!hook) {
        next()
      } else {
        var res = hook.call(null, transition)
        if (typeof res === 'boolean') {
          res ? next() : abort()
        } else if (routerUtil.isPromise(res)) {
          res.then(function (ok) {
            ok ? next() : abort()
          }, abort)
        }
      }
    }
  )
}

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
