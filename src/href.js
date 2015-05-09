// install v-link, which provides navigation support for
// HTML5 history mode

module.exports = function (Vue) {
  Vue.directive('href', {
    bind: function () {
      var vm = this.vm
      var href = this.expression.replace(/^\//, '')
      this.handler = function (e) {
        e.preventDefault()
        var router = vm.route._router
        router.go((router._root || '') + '/' + href)
      }
      this.el.addEventListener('click', this.handler)
    },
    unbind: function () {
      this.el.removeEventListener('click', this.handler)
    }
  })
}