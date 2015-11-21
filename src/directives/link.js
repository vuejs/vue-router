import { warn } from '../util'
const trailingSlashRE = /\/$/
const regexEscapeRE = /[-.*+?^${}()|[\]\/\\]/g
const queryStringRE = /\?.*$/

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
      // no need to handle click if link expects to be opened
      // in a new window/tab.
      /* istanbul ignore if */
      if (this.el.tagName === 'A' &&
          this.el.getAttribute('target') === '_blank') {
        return
      }
      // handle click
      let router = vm.$route.router
      this.handler = (e) => {
        // don't redirect with control keys
        if (e.metaKey || e.ctrlKey || e.shiftKey) return
        // don't redirect when preventDefault called
        if (e.defaultPrevented) return
        // don't redirect on right click
        if (e.button !== 0) return

        const target = this.target
        const go = (target) => {
          e.preventDefault()
          if (target != null) {
            router.go(target)
          }
        }

        if (this.el.tagName === 'A' || e.target === this.el) {
          // v-link on <a v-link="'path'">
          go(target)
        } else {
          // v-link delegate on <div v-link>
          var el = e.target
          while (el && el.tagName !== 'A' && el !== this.el) {
            el = el.parentNode
          }
          if (!el) return
          if (el.tagName !== 'A' || !el.href) {
            // allow not anchor
            go(target)
          } else if (sameOrigin(el)) {
            go({
              path: el.pathname,
              replace: target && target.replace,
              append: target && target.append
            })
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
      let append
      this.target = path
      if (_.isObject(path)) {
        append = path.append
        this.exact = path.exact
        this.prevActiveClass = this.activeClass
        this.activeClass = path.activeClass
      }
      path = this.path = router._stringifyPath(path)
      this.activeRE = path && !this.exact
        ? new RegExp(
            '^' +
            path.replace(/\/$/, '').replace(regexEscapeRE, '\\$&') +
            '(\\/|$)'
          )
        : null
      this.updateClasses(this.vm.$route.path)
      let isAbsolute = path.charAt(0) === '/'
      // do not format non-hash relative paths
      let href = path && (router.mode === 'hash' || isAbsolute)
        ? router.history.formatPath(path, append)
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
      let router = this.vm.$route.router
      let activeClass = this.activeClass || router._linkActiveClass
      // clear old class
      if (this.prevActiveClass !== activeClass) {
        _.removeClass(el, this.prevActiveClass)
      }
      // remove query string before matching
      let dest = this.path.replace(queryStringRE, '')
      path = path.replace(queryStringRE, '')
      // add new class
      if (this.exact) {
        if (
          dest === path ||
          (
            // also allow additional trailing slash
            dest.charAt(dest.length - 1) !== '/' &&
            dest === path.replace(trailingSlashRE, '')
          )
        ) {
          _.addClass(el, activeClass)
        } else {
          _.removeClass(el, activeClass)
        }
      } else {
        if (this.activeRE &&
            this.activeRE.test(path)) {
          _.addClass(el, activeClass)
        } else {
          _.removeClass(el, activeClass)
        }
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
