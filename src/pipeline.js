var util = require('./util')

/**
 * Determine the reusability of an existing router view.
 *
 * @param {Directive} view
 * @param {Object} handler
 * @param {Transition} transition
 */

exports.canReuse = function (view, handler, transition) {
  var component = view.childVM
  if (!component || !handler) {
    return false
  }
  if (component.constructor !== handler.component) {
    return false
  }
  var canReuseFn = util.getRouteConfig(component, 'canReuse')
  return typeof canReuseFn === 'boolean'
    ? canReuseFn
    : canReuseFn
      ? canReuseFn.call(component, transition)
      : true // defaults to true
}

/**
 * Check if a component can deactivate.
 *
 * @param {Directive} view
 * @param {Transition} transition
 * @param {Function} next
 */

exports.canDeactivate = function (view, transition, next) {
  var fromComponent = view.childVM
  var hook = util.getRouteConfig(fromComponent, 'canDeactivate')
  if (!hook) {
    next()
  } else {
    transition.callHook(hook, fromComponent, next, true)
  }
}

/**
 * Check if a component can activate.
 *
 * @param {Object} handler
 * @param {Transition} transition
 * @param {Function} next
 */

exports.canActivate = function (handler, transition, next) {
  util.resolveAsyncComponent(handler, function (Component) {
    // have to check due to async-ness
    if (transition.to._aborted) {
      return
    }
    // determine if this component can be activated
    var hook = util.getRouteConfig(Component, 'canActivate')
    if (!hook) {
      next()
    } else {
      transition.callHook(hook, null, next, true)
    }
  })
}

/**
 * Call deactivate hooks for existing router-views.
 *
 * @param {Directive} view
 * @param {Transition} transition
 * @param {Function} next
 */

exports.deactivate = function (view, transition, next) {
  var component = view.childVM
  var hook = util.getRouteConfig(component, 'deactivate')
  if (!hook) {
    next()
  } else {
    transition.callHook(hook, component, next)
  }
}

/**
 * Activate / switch component for a router-view.
 *
 * @param {Directive} view
 * @param {Transition} transition
 * @param {Function} [cb]
 */

exports.activate = function (view, transition, cb) {
  var handler = transition.activateQueue[view.depth]
  if (!handler) {
    view.setComponent(null)
    cb && cb()
    return
  }

  var Component = handler.component
  var activateHook = util.getRouteConfig(Component, 'activate')
  var dataHook = util.getRouteConfig(Component, 'data')

  // partially duplicated logic from v-component
  var build = function () {
    view.unbuild(true)
    view.Ctor = view.Component = Component
    var component = view.build()
    if (dataHook) {
      loadData(component, transition, dataHook)
    }
    view.transition(component)
    cb && cb()
  }

  if (activateHook) {
    transition.callHook(activateHook, null, build)
  } else {
    build()
  }
}

/**
 * Reuse a view, just reload data if necessary.
 *
 * @param {Directive} view
 * @param {Transition} transition
 */

exports.reuse = function (view, transition) {
  var component = view.childVM
  var dataHook = util.getRouteConfig(component)
  if (dataHook) {
    loadData(component, transition, dataHook)
  }
}

/**
 * Asynchronously load and apply data to component.
 *
 * @param {Vue} component
 * @param {Transition} transition
 * @param {Function} hook
 */

function loadData (component, transition, hook) {
  component.$loading = true
  transition.callHook(hook, component, function (data) {
    if (data) {
      for (var key in data) {
        component.$set(key, data[key])
      }
    }
    component.$loading = false
  })
}
