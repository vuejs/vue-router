export default function (Vue) {

  var _ = Vue.util

  Vue.mixin({
    created: function () {
      var route = this.$root.$route
      if (route) {
        route.router._children.push(this)
        if (!this.$route) {
          _.defineReactive(this, '$route', route)
        }
      }
    },
    beforeDestroy: function () {
      var route = this.$root.$route
      if (route) {
        route.router._children.$remove(this)
      }
    }
  })
}
