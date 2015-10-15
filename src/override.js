export default function (Vue) {

  const _ = Vue.util

  const init = Vue.prototype._init
  Vue.prototype._init = function (options) {
    const root = options._parent || options.parent || this
    const route = root.$route
    if (route) {
      route.router._children.push(this)
      if (!this.$route) {
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
}
