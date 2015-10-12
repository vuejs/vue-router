export default function (Vue) {

  const _ = Vue.util
  const mixin = {
    init: function () {
      const route = this.$root.$route
      if (route) {
        route.router._children.push(this)
        if (!this.$route) {
          _.defineReactive(this, '$route', route)
        }
      }
    },
    beforeDestroy: function () {
      const route = this.$root.$route
      if (route) {
        route.router._children.$remove(this)
      }
    }
  }

  // pre 1.0.0-rc compat
  if (!Vue.config.optionMergeStrategies ||
      !Vue.config.optionMergeStrategies.init) {
    delete mixin.init
    const init = Vue.prototype._init
    Vue.prototype._init = function (options) {
      const root = options._parent || options.parent || this
      const route = root.$route
      if (route) {
        route.router._children.push(this)
        if (!this.$route) {
          if (this._defineMeta) {
            this._defineMeta('$route', route)
          } else {
            _.defineReactive(this, '$route', route)
          }
        }
      }
      init.call(this, options)
    }
  }

  if (Vue.mixin) {
    Vue.mixin(mixin)
  } else {
    // 0.12 compat
    Vue.options = _.mergeOptions(Vue.options, mixin)
  }
}
