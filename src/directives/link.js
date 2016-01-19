import { warn } from '../util'
const trailingSlashRE = /\/$/
const regexEscapeRE = /[-.*+?^${}()|[\]\/\\]/g
const queryStringRE = /\?.*$/

// install v-link, which provides navigation support for
// HTML5 history mode
export default function (Vue) {

  const {
    bind,
    isObject,
    addClass,
    removeClass
  } = Vue.util

  Vue.directive('link-active', {
    priority: 1001,
    bind () {
      this.el.__v_link_active = true
    }
  })

  Vue.directive('link', {
    priority: 1000,

    bind () {
      const vm = this.vm
      /* istanbul ignore if */
      if (!vm.$route) {
        warn('v-link can only be used inside a router-enabled app.')
        return
      }
      this.router = vm.$route.router
      // update things when the route changes
      this.unwatch = vm.$watch('$route', bind(this.onRouteUpdate, this))
      // check if active classes should be applied to a different element
      this.activeEl = this.el
      var parent = this.el.parentNode
      while (parent) {
        if (parent.__v_link_active) {
          this.activeEl = parent
          break
        }
        parent = parent.parentNode
      }
      // no need to handle click if link expects to be opened
      // in a new window/tab.
      /* istanbul ignore if */
      if (this.el.tagName === 'A' &&
          this.el.getAttribute('target') === '_blank') {
        return
      }
      // handle click
      this.el.addEventListener('click', bind(this.onClick, this))
    },

    update (target) {
      this.target = target
      if (isObject(target)) {
        this.append = target.append
        this.exact = target.exact
        this.prevActiveClass = this.activeClass
        this.activeClass = target.activeClass
      }
      this.onRouteUpdate(this.vm.$route)
    },

    onClick (e) {
      // don't redirect with control keys
      /* istanbul ignore if */
      if (e.metaKey || e.ctrlKey || e.shiftKey) return
      // don't redirect when preventDefault called
      /* istanbul ignore if */
      if (e.defaultPrevented) return
      // don't redirect on right click
      /* istanbul ignore if */
      if (e.button !== 0) return

      const target = this.target
      if (target) {
        // v-link with expression, just go
        e.preventDefault()
        this.router.go(target)
      } else {
        // no expression, delegate for an <a> inside
        var el = e.target
        while (el.tagName !== 'A' && el !== this.el) {
          el = el.parentNode
        }
        if (el.tagName === 'A' && sameOrigin(el)) {
          e.preventDefault()
          this.router.go({
            path: el.pathname,
            replace: target && target.replace,
            append: target && target.append
          })
        }
      }
    },

    onRouteUpdate (route) {
      // router._stringifyPath is dependent on current route
      // and needs to be called again whenver route changes.
      var newPath = this.router._stringifyPath(this.target)
      if (this.path !== newPath) {
        this.path = newPath
        this.updateActiveMatch()
        this.updateHref()
      }
      this.updateClasses(route.path)
    },

    updateActiveMatch () {
      this.activeRE = this.path && !this.exact
        ? new RegExp(
            '^' +
            this.path
              .replace(/\/$/, '')
              .replace(queryStringRE, '')
              .replace(regexEscapeRE, '\\$&') +
            '(\\/|$)'
          )
        : null
    },

    updateHref () {
      if (this.el.tagName !== 'A') {
        return
      }
      const path = this.path
      const router = this.router
      const isAbsolute = path.charAt(0) === '/'
      // do not format non-hash relative paths
      const href = path && (router.mode === 'hash' || isAbsolute)
        ? router.history.formatPath(path, this.append)
        : path
      if (href) {
        this.el.href = href
      } else {
        this.el.removeAttribute('href')
      }
    },

    updateClasses (path) {
      const el = this.activeEl
      const activeClass = this.activeClass || this.router._linkActiveClass
      // clear old class
      if (this.prevActiveClass !== activeClass) {
        removeClass(el, this.prevActiveClass)
      }
      // remove query string before matching
      const dest = this.path.replace(queryStringRE, '')
      path = path.replace(queryStringRE, '')
      // add new class
      if (this.exact) {
        if (dest === path || (
          // also allow additional trailing slash
          dest.charAt(dest.length - 1) !== '/' &&
          dest === path.replace(trailingSlashRE, '')
        )) {
          addClass(el, activeClass)
        } else {
          removeClass(el, activeClass)
        }
      } else {
        if (this.activeRE && this.activeRE.test(path)) {
          addClass(el, activeClass)
        } else {
          removeClass(el, activeClass)
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
