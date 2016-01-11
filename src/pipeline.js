import { getRouteConfig, resolveAsyncComponent, isPromise } from './util'

/**
 * Determine the reusability of an existing router view.
 *
 * @param {Directive} view
 * @param {Object} handler
 * @param {Transition} transition
 */

export function canReuse (view, handler, transition) {
  let component = view.childVM
  if (!component || !handler) {
    return false
  }
  // important: check view.Component here because it may
  // have been changed in activate hook
  if (view.Component !== handler.component) {
    return false
  }
  let canReuseFn = getRouteConfig(component, 'canReuse')
  return typeof canReuseFn === 'boolean'
    ? canReuseFn
    : canReuseFn
      ? canReuseFn.call(component, {
        to: transition.to,
        from: transition.from
      }) : true // defaults to true
}

/**
 * Check if a component can deactivate.
 *
 * @param {Directive} view
 * @param {Transition} transition
 * @param {Function} next
 */

export function canDeactivate (view, transition, next) {
  let fromComponent = view.childVM
  let hook = getRouteConfig(fromComponent, 'canDeactivate')
  if (!hook) {
    next()
  } else {
    transition.callHook(hook, fromComponent, next, {
      expectBoolean: true
    })
  }
}

/**
 * Check if a component can activate.
 *
 * @param {Object} handler
 * @param {Transition} transition
 * @param {Function} next
 */

export function canActivate (handler, transition, next) {
  resolveAsyncComponent(handler, (Component) => {
    // have to check due to async-ness
    if (transition.aborted) {
      return
    }
    // determine if this component can be activated
    let hook = getRouteConfig(Component, 'canActivate')
    if (!hook) {
      next()
    } else {
      transition.callHook(hook, null, next, {
        expectBoolean: true
      })
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

export function deactivate (view, transition, next) {
  let component = view.childVM
  let hook = getRouteConfig(component, 'deactivate')
  if (!hook) {
    next()
  } else {
    transition.callHooks(hook, component, next)
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

export function activate (view, transition, depth, cb, reuse) {
  let handler = transition.activateQueue[depth]
  if (!handler) {
    // fix 1.0.0-alpha.3 compat
    if (view._bound) {
      view.setComponent(null)
    }
    cb && cb()
    return
  }

  let Component = view.Component = handler.component
  let activateHook = getRouteConfig(Component, 'activate')
  let dataHook = getRouteConfig(Component, 'data')
  let waitForData = getRouteConfig(Component, 'waitForData')

  view.depth = depth
  view.activated = false

  let component
  let loading = !!(dataHook && !waitForData)

  // "reuse" is a flag passed down when the parent view is
  // either reused via keep-alive or as a child of a kept-alive view.
  // of course we can only reuse if the current kept-alive instance
  // is of the correct type.
  reuse = reuse && view.childVM && view.childVM.constructor === Component

  if (reuse) {
    // just reuse
    component = view.childVM
    component.$loadingRouteData = loading
  } else {
    // unbuild current component. this step also destroys
    // and removes all nested child views.
    view.unbuild(true)

    // handle keep-alive.
    // cache the child view on the kept-alive child vm.
    if (view.keepAlive && view.childVM && view.childView) {
      view.childVM._keepAliveRouterView = view.childView
    }

    // build the new component. this will also create the
    // direct child view of the current one. it will register
    // itself as view.childView.
    component = view.build({
      _meta: {
        $loadingRouteData: loading
      },
      created () {
        this._routerView = view
      }
    })

    // handle keep-alive.
    // when a kept-alive child vm is restored, we need to
    // add its cached child views into the router's view list,
    // and also properly update current view's child view.
    if (view.keepAlive) {
      component.$loadingRouteData = loading
      let cachedChildView = component._keepAliveRouterView
      if (cachedChildView) {
        view.childView = cachedChildView
        component._keepAliveRouterView = null
      }
    }
  }

  // cleanup the component in case the transition is aborted
  // before the component is ever inserted.
  let cleanup = () => {
    component.$destroy()
  }

  // actually insert the component and trigger transition
  let insert = () => {
    if (reuse) {
      cb && cb()
      return
    }
    let router = transition.router
    if (router._rendered || router._transitionOnLoad) {
      view.transition(component)
    } else {
      // no transition on first render, manual transition
      /* istanbul ignore if */
      if (view.setCurrent) {
        // 0.12 compat
        view.setCurrent(component)
      } else {
        // 1.0
        view.childVM = component
      }
      component.$before(view.anchor, null, false)
    }
    cb && cb()
  }

  // called after activation hook is resolved
  let afterActivate = () => {
    view.activated = true
    // activate the child view
    if (view.childView) {
      activate(view.childView, transition, depth + 1, null, reuse || view.keepAlive)
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
    transition.callHooks(activateHook, component, afterActivate, {
      cleanup: cleanup
    })
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

export function reuse (view, transition) {
  let component = view.childVM
  let dataHook = getRouteConfig(component, 'data')
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
  transition.callHooks(hook, component, (data, onError) => {
    // merge data from multiple data hooks
    if (Array.isArray(data) && data._needMerge) {
      data = data.reduce((res, obj) => {
        if (isPlainObject(obj)) {
          Object.keys(obj).forEach(key => {
            res[key] = obj[key]
          })
        }
        return res
      }, Object.create(null))
    }
    // handle promise sugar syntax
    let promises = []
    if (isPlainObject(data)) {
      Object.keys(data).forEach(key => {
        let val = data[key]
        if (isPromise(val)) {
          promises.push(val.then(resolvedVal => {
            component.$set(key, resolvedVal)
          }))
        } else {
          component.$set(key, val)
        }
      })
    }
    if (!promises.length) {
      component.$loadingRouteData = false
      component.$emit('route-data-loaded', component)
      cb && cb()
    } else {
      promises[0].constructor.all(promises).then(_ => {
        component.$loadingRouteData = false
        component.$emit('route-data-loaded', component)
        cb && cb()
      }, onError)
    }
  }, {
    cleanup: cleanup,
    expectData: true
  })
}

function isPlainObject (obj) {
  return Object.prototype.toString.call(obj) === '[object Object]'
}
