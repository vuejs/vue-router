export default function (Vue) {

  const _ = Vue.util

  // override Vue's init and destroy process to keep track of router instances
  const init = Vue.prototype._init
  Vue.prototype._init = function (options) {
    const root = options._parent || options.parent || this
    const route = root.$route
    if (route) {
      route.router._children.push(this)
      if (!this.$route) {
        /* istanbul ignore if */
        if (this._defineMeta) {
          // 0.12
          this._defineMeta('$route', route)
        } else {
          // 1.0
          _.defineReactive(this, '$route', route)
        }
      }
    }
    init.call(this, options)
  }

  const destroy = Vue.prototype._destroy
  Vue.prototype._destroy = function () {
    if (!this._isBeingDestroyed) {
      const route = this.$root.$route
      if (route) {
        route.router._children.$remove(this)
      }
      destroy.apply(this, arguments)
    }
  }

  // 1.0 only: enable route mixins
  const strats = Vue.config.optionMergeStrategies
  const hooksToMergeRE = /^(data|activate|deactivate)$/

  if (strats) {
    strats.route = (parentVal, childVal) => {
      if (!childVal) return parentVal
      if (!parentVal) return childVal
      const ret = {}
      _.extend(ret, parentVal)
      for (let key in childVal) {
        let a = ret[key]
        let b = childVal[key]
        // for data, activate and deactivate, we need to merge them into
        // arrays similar to lifecycle hooks.
        if (a && hooksToMergeRE.test(key)) {
          ret[key] = (_.isArray(a) ? a : [a]).concat(b)
        } else {
          ret[key] = b
        }
      }
      return ret
    }
  }
}
