// install v-link, which provides navigation support for
// HTML5 history mode

module.exports = function (Vue) {

  Vue.directive('link', {

    bind: function () {
      var vm = this.vm
      // normalize leading slash
      var href = '/' + this.expression.replace(/^\//, '')
      if (this.el.tagName === 'A') {
        this.el.href = href
      }
      this.handler = function (e) {
        e.preventDefault()
        var router = vm.route._router
        router.go((router._root || '') + href)
      }
      this.el.addEventListener('click', this.handler)
    },

    unbind: function () {
      this.el.removeEventListener('click', this.handler)
    }

  })

}