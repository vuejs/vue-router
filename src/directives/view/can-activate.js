var routerUtil = require('../../util')

module.exports = function (transition) {
  var to = transition.to
  if (to._aborted) {
    return
  }

  var self = this
  function next () {
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

  // determine reusability
  transition._reuse = transition._componentID === this._routeComponentID

  // resolve async component.
  // this.resolveCtor for compat <= 0.12.8
  var resolver = this.resolveCtor || this.resolveComponent
  resolver.call(
    this,
    transition._componentID,
    function onComponentResolved () {
      if (to._aborted) {
        return
      }

      // self.Ctor for compat <= 0.12.8
      var Component = transition._Component = self.Ctor || self.Component

      // check force reload
      if (routerUtil.getRouteConfig(Component, 'reload')) {
        transition._reuse = false
      }

      // determine if this component can be activated
      var hook = routerUtil.getRouteConfig(Component, 'canActivate')
      if (!hook) {
        next()
      } else {
        transition.callHook(hook, null, next, true)
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
