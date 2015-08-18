import { warn } from '../util'

// install v-link, which provides navigation support for
// HTML5 history mode
export default function (Vue) {

  let _ = Vue.util

  Vue.directive('link', {

    isLiteral: true,

    bind: function () {
      let vm = this.vm
      /* istanbul ignore if */
      if (!vm.$route) {
        warn(
          'v-link can only be used inside a ' +
          'router-enabled app.'
        )
        return
      }
      let router = vm.$route.router
      this.handler = (e) => {
        if (e.button === 0) {
          e.preventDefault()
          if (this.destination != null) {
            router.go(this.destination)
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
      let el = this.el
      let dest = this.destination
      let router = this.vm.$route.router
      let activeClass = router._linkActiveClass
      let exactClass = activeClass + '-exact'
      if (path.indexOf(dest) === 0 && path !== '/') {
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
      let router = this.vm.$route.router
      let isAbsolute = path.charAt(0) === '/'
      // do not format non-hash relative paths
      let href = router.mode === 'hash' || isAbsolute
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
