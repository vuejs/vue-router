// install v-link, which provides navigation support for
// HTML5 history mode

module.exports = function (Vue) {

  var _ = Vue.util

  Vue.directive('link', {

    isLiteral: true,

    bind: function () {
      var vm = this.vm
      if (!vm.route && _.warn) {
        _.warn(
          'v-link can only be used inside a ' +
          'router-enabled app.'
        )
        return
      }
      var self = this
      this.handler = function (e) {
        if (e.button === 0) {
          e.preventDefault()
          if (self.destination != null) {
            vm.route._router.go(self.destination)
          }
        }
      }
      this.el.addEventListener('click', this.handler)
      if (!this._isDynamicLiteral) {
        this.update(this.expression)
      }
    },

    unbind: function () {
      this.el.removeEventListener('click', this.handler)
    },

    update: function (path) {
      this.destination = path
      path = path || ''
      var router = this.vm.route._router
      var href = router._history
        ? path.charAt(0) === '/'
          // only format the path if it's absolute
          ? router._formatPath(path)
          : path
        : router._formatHashPath(path)
      if (this.el.tagName === 'A') {
        if (href) {
          this.el.href = href
        } else {
          this.el.removeAttribute('href')
        }
      }
    }
  })
}
