// install v-link, which provides navigation support for
// HTML5 history mode

module.exports = function (Vue) {

  var _ = Vue.util

  Vue.directive('link', {

    isLiteral: true,

    bind: function () {
      var vm = this.vm
      if (!vm.route) {
        _.warn && _.warn(
          'v-link can only be used inside a ' +
          'router-enabled app.'
        )
        return
      }
      var self = this
      this.handler = function (e) {
        e.preventDefault()
        vm.route._router.go(self.destination)
      }
      this.el.addEventListener('click', this.handler)
      if (!this._isDynamicLiteral) {
        this.update(this.expression)
      }
    },

    unbind: function () {
      this.el.removeEventListener('click', this.handler)
    },

    update: function (value) {
      this.destination = value
      if (this.el.tagName === 'A') {
        this.el.href = value
      }
    }

  })

}