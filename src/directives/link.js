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

  const onPriority = Vue.directive('on').priority

  Vue.directive('link-active', {
    priority: onPriority - 1,

    bind () {
      const vm = this.vm
      /* istanbul ignore if */
      if (!vm.$route) {
        warn('v-link-active can only be used inside a router-enabled app.')
        return
      }
      this.unwatch = vm.$watch('$route', bind(this.onRouteUpdate, this))
      this.vm.$on('v-link-update', bind(this.onRouteUpdate, this))
      this.el.__v_link_active = true
      this.el.__v_links = []
    },

    onRouteUpdate (route) {
      // check one of v-links is matched to the current route
      let matched = null
      this.el.__v_links.forEach((link) => {
        if (link.match(route.path)) {
          matched = link
        }
      })
      if (matched) {
        const activeClass = matched.activeClass || matched.router._linkActiveClass
        this.prevActiveClass = activeClass
        addClass(this.el, activeClass)
      } else {
        removeClass(this.el, this.prevActiveClass)
      }
    },

    unbind () {
      this.el.__v_links = []
      this.unwatch && this.unwatch()
    }
  })

  Vue.directive('link', {
    priority: onPriority - 2,

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
      this.activeEls = []
      // find all link-active elements in parents to handle nested active links
      var parent = this.el
      while (parent) {
        if (parent.__v_link_active) {
          parent.__v_links.push(this)
          this.activeEls.push(parent)
        }
        parent = parent.parentNode
      }
      if (this.activeEls.length === 0) {
        this.activeEls.push(this.el)
      }
      // no need to handle click if link expects to be opened
      // in a new window/tab.
      /* istanbul ignore if */
      if (this.el.tagName === 'A' &&
          this.el.getAttribute('target') === '_blank') {
        return
      }
      // handle click
      this.handler = bind(this.onClick, this)
      this.el.addEventListener('click', this.handler)
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
      // dispatch event to call all parents noRouteUpdate
      this.vm.$dispatch('v-link-update', this.vm.$route)
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
          var path = el.pathname
          if (this.router.history.root) {
            path = path.replace(this.router.history.rootRE, '')
          }
          this.router.go({
            path: path,
            replace: target && target.replace,
            append: target && target.append
          })
        }
      }
    },

    onRouteUpdate (route) {
      // router.stringifyPath is dependent on current route
      // and needs to be called again whenver route changes.
      var newPath = this.router.stringifyPath(this.target)
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

    match (path) {
      // remove query string before matching
      const dest = this.path.replace(queryStringRE, '')
      path = path.replace(queryStringRE, '')
      // add new class
      if (this.exact) {
        return dest === path || (
          // also allow additional trailing slash
          dest.charAt(dest.length - 1) !== '/' &&
          dest === path.replace(trailingSlashRE, '')
        )
      } else {
        return this.activeRE && this.activeRE.test(path)
      }
    },

    updateClasses (path) {
      const activeClass = this.activeClass || this.router._linkActiveClass
      // clear old class
      if (this.prevActiveClass !== activeClass) {
        this.activeEls.forEach((el) => {
          removeClass(el, this.prevActiveClass)
        })
      }
      // updates self classes when no v-link-active exists
      if (this.activeEls[0] === this.el) {
        this.match(path)
          ? addClass(this.el, activeClass)
          : removeClass(this.el, activeClass)
      }
    },

    unbind () {
      this.activeEls = []
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
