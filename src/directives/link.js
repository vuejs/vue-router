// install v-link, which provides navigation support for
// HTML5 history mode

module.exports = function (Vue) {

  var _ = Vue.util
  var routerUtil = require('../util')

  Vue.directive('link', {

    isLiteral: true,

    bind: function () {
      var vm = this.vm
      /* istanbul ignore if */
      if (!vm.$route) {
        routerUtil.warn(
          'v-link can only be used inside a ' +
          'router-enabled app.'
        )
        return
      }
      var self = this
      var router = vm.$route._router
      this.handler = function (e) {
        if (e.button === 0) {
          e.preventDefault()
          if (self.destination != null) {
            router.go(self.destination)
          }
        }
      }
      this.el.addEventListener('click', this.handler)
      if (!this._isDynamicLiteral) {
        this.update(this.expression)
      }
      // manage active link class
      this.unwatch = vm.$watch(
        '$route.path',
        _.bind(this.updateClasses, this)
      )
    },

    updateClasses: function (path) {
      var el = this.el
      var dest = this.destination
      var router = this.vm.$route._router
      var activeClass = router._linkActiveClass
      var exactClass = activeClass + '-exact'
      if (path.indexOf(dest) === 0) {
        _.addClass(el, activeClass)
      } else {
        _.removeClass(el, activeClass)
      }
      if (path === dest) {
        _.addClass(el, exactClass)
      } else {
        _.removeClass(el, exactClass)
      }
    },

    update: function (path) {
      this.destination = path
      this.updateClasses(this.vm.$route.path)
      path = path || ''
      var router = this.vm.$route._router
      var isAbsolute = path.charAt(0) === '/'
      // do not format non-hash relative paths
      var href = router.mode === 'hash' || isAbsolute
        ? router.history.formatPath(path)
        : path
      if (this.el.tagName === 'A') {
        if (href) {
          this.el.href = href
        } else {
          this.el.removeAttribute('href')
        }
      }
    },

    unbind: function () {
      this.el.removeEventListener('click', this.handler)
      this.unwatch && this.unwatch()
    }
  })
}
