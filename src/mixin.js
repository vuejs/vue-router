export default function (Vue) {

  const _ = Vue.util
  const mixin = {
    created: function () {
      var route = this.$root.$route
      if (route) {
        route.router._children.push(this)
        if (!this.$route) {
          if (this._defineMeta) {
            // 0.12 compat
            this._defineMeta('$route', route)
          } else {
            _.defineReactive(this, '$route', route)
          }
        }
      }
    },
    beforeDestroy: function () {
      var route = this.$root.$route
      if (route) {
        route.router._children.$remove(this)
      }
    }
  }

  if (Vue.mixin) {
    Vue.mixin(mixin)
  } else {
    // 0.12 compat
    Vue.options = _.mergeOptions(Vue.options, mixin)
  }
}
