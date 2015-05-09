// install v-link, which provides navigation support for
// HTML5 history mode

module.exports = function (Vue) {

  Vue.directive('link', {

    bind: function () {
      var vm = this.vm
      var href = this.expression
      if (this.el.tagName === 'A') {
        this.el.href = href
      }
      this.handler = function (e) {
        e.preventDefault()
        vm.route._router.go(href)
      }
      this.el.addEventListener('click', this.handler)
    },

    unbind: function () {
      this.el.removeEventListener('click', this.handler)
    }

  })

}