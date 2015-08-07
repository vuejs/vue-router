var util = require('./util')

/**
 * Determine the reusability of an existing router view.
 *
 * @param {Transition} transition
 * @param {Directive} view
 * @param {Object} handler
 */

exports.canReuse = function (transition, view, handler) {
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
 * @param {Transition} transition
 * @param {Directive} view
 * @param {Function} next
 */

exports.canDeactivate = function (transition, view, next) {
  var fromComponent = view.childVM
  var hook = util.getRouteConfig(fromComponent, 'canDeactivate')
  if (!hook) {
    next()
  } else {
    transition._callHook(hook, fromComponent, next, true)
  }
}

/**
 * Check if a component can activate.
 *
 * @param {Transition} transition
 * @param {Object} handler
 * @param {Function} next
 */

exports.canActivate = function (transition, handler, next) {
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
      transition._callHook(hook, null, next, true)
    }
  })
}

/**
 * Call deactivate hooks for existing router-views.
 *
 * @param {Transition} transition
 * @param {Directive} view
 * @param {Function} next
 */

exports.deactivate = function (transition, view, next) {
  var fromComponent = view.childVM
  var hook = util.getRouteConfig(fromComponent, 'deactivate')
  if (!hook) {
    next()
  } else {
    transition._callHook(hook, fromComponent, next)
  }
}
