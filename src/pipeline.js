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
  // important: check view.Component here because it may
  // have been changed in activate hook
  if (view.Component !== handler.component) {
    return false
  }
  var canReuseFn = util.getRouteConfig(component, 'canReuse')
  return typeof canReuseFn === 'boolean'
    ? canReuseFn
    : canReuseFn
      ? canReuseFn.call(component, {
          to: transition.to,
          from: transition.from
        })
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
    if (transition.aborted) {
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
 * @param {Number} depth
 * @param {Function} [cb]
 */

exports.activate = function (view, transition, depth, cb) {
  var handler = transition.activateQueue[depth]
  if (!handler) {
    view.setComponent(null)
    cb && cb()
    return
  }

  var Component = view.Component = handler.component
  var activateHook = util.getRouteConfig(Component, 'activate')
  var dataHook = util.getRouteConfig(Component, 'data')
  var waitForData = util.getRouteConfig(Component, 'waitForData')

  // unbuild current component. this step also destroys
  // and removes all nested child views.
  view.unbuild(true)
  // build the new component. this will also create the
  // direct child view of the current one. it will register
  // itself as view.childView.
  var component = view.build({
    _meta: {
      $loadingRouteData: !!(dataHook && !waitForData)
    }
  })

  // cleanup the component in case the transition is aborted
  // before the component is ever inserted.
  var cleanup = function () {
    component.$destroy()
  }

  // actually insert the component and trigger transition
  var insert = function () {
    var router = transition.router
    if (router._rendered || router._transitionOnLoad) {
      view.transition(component)
    } else {
      // no transition on first render, manual transition
      view.setCurrent(component)
      component.$before(view.anchor, null, false)
    }
    cb && cb()
  }

  // called after activation hook is resolved
  var afterActivate = function () {
    // activate the child view
    if (view.childView) {
      exports.activate(view.childView, transition, depth + 1)
    }
    if (dataHook && waitForData) {
      // wait until data loaded to insert
      loadData(component, transition, dataHook, insert, cleanup)
    } else {
      // load data and insert at the same time
      if (dataHook) {
        loadData(component, transition, dataHook)
      }
      insert()
    }
  }

  if (activateHook) {
    transition.callHook(activateHook, component, afterActivate, false, cleanup)
  } else {
    afterActivate()
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
  var dataHook = util.getRouteConfig(component, 'data')
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
 * @param {Function} cb
 * @param {Function} cleanup
 */

function loadData (component, transition, hook, cb, cleanup) {
  component.$loadingRouteData = true
  transition.callHook(hook, component, function (data) {
    for (var key in data) {
      component.$set(key, data[key])
    }
    component.$loadingRouteData = false
    cb && cb(data)
  }, false, cleanup)
}
