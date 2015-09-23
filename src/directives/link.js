import { warn } from '../util'
const regexEscapeRE = /[-.*+?^${}()|[\]\/\\]/g

// install v-link, which provides navigation support for
// HTML5 history mode
export default function (Vue) {

  let _ = Vue.util

  Vue.directive('link', {

    bind () {
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
        // don't redirect with control keys
        if (e.metaKey || e.ctrlKey || e.shiftKey) return
        // don't redirect when preventDefault called
        if (e.defaultPrevented) return
        // don't redirect on right click
        if (e.button !== 0) return

        if (this.el.tagName === 'A') {
          // v-link on <a v-link="'path'">
          e.preventDefault()
          if (this.destination != null) {
            router.go(this.destination)
          }
        } else {
          // v-link delegate on <div v-link>
          var el = e.target
          while (el && el.tagName !== 'A' && el !== this.el) {
            el = el.parentNode
          }
          if (!el || el.tagName !== 'A' || !el.href) return
          if (sameOrigin(el)) {
            e.preventDefault()
            router.go(el.pathname)
          }
        }
      }
      this.el.addEventListener('click', this.handler)
      // manage active link class
      this.unwatch = vm.$watch(
        '$route.path',
        _.bind(this.updateClasses, this)
      )
    },

    update (path) {
      let router = this.vm.$route.router
      path = router._normalizePath(path)
      this.destination = path
      this.activeRE = path
        ? new RegExp('^' + path.replace(regexEscapeRE, '\\$&') + '\\b')
        : null
      this.updateClasses(this.vm.$route.path)
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

    updateClasses (path) {
      let el = this.el
      let dest = this.destination
      let router = this.vm.$route.router
      let activeClass = router._linkActiveClass
      let exactClass = activeClass + '-exact'
      if (this.activeRE &&
          this.activeRE.test(path) &&
          path !== '/') {
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

    unbind () {
      this.el.removeEventListener('click', this.handler)
      this.unwatch && this.unwatch()
    }
  })

  function sameOrigin (link) {
    return link.protocol === location.protocol &&
      link.hostname === location.hostname &&
      link.port === location.port
  }
}
