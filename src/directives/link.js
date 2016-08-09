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
  const LINK_UPDATE = '__vue-router-link-update__'

  let activeId = 0

  Vue.directive('link-active', {
    priority: 9999,
    bind () {
      const id = String(activeId++)
      // collect v-links contained within this element.
      // we need do this here before the parent-child relationship
      // gets messed up by terminal directives (if, for, components)
      const childLinks = this.el.querySelectorAll('[v-link]')

      // holds a number of active
      // links sharing the same class
      this.classes = {}
      // holds IDs of links
      // included into the state
      this.links = []

      for (var i = 0, l = childLinks.length; i < l; i++) {
        let link = childLinks[i]
        let existingId = link.getAttribute(LINK_UPDATE)
        let value = existingId ? (existingId + ',' + id) : id
        // leave a mark on the link element which can be persisted
        // through fragment clones.
        link.setAttribute(LINK_UPDATE, value)
      }

      // watch $route change and create a state
      // to be able to track updates for each link
      this.unwatch = this.vm.$watch('$route', bind(this.onRouteUpdate, this))

      // build up new state if $route is changed
      // or react to changes of updated link otherwise
      this.vm.$on(LINK_UPDATE, this.cb = (link, path) => {
        if (link.activeIds.indexOf(id) > -1) {
          let cls = link.getActiveClass()
          // if path or activeClass properties
          // of individual link were updated
          if (this.links.indexOf(link.id) >= 0) {
            // remove previous class if it is updated
            this.removeClass(link.prevActiveClass)
            if (link.isActive(path)) {
              this.addClass(cls)
            }
            else {
              this.removeClass(cls)
            }
          }
          // if route has changed
          // build up new state
          else {
            this.links.push(link.id)
            if (link.isActive(path)) {
              this.addClass(cls)
            }
          }
        }
      })
    },

    addClass (cls) {
        // store how many active links build up a class
        if (!this.classes[cls]) {
          this.classes[cls] = 1
          this.el.classList.add(cls)
        }
        else {
          this.classes[cls]++
        }
    },

    removeClass (cls) {
      // ignore empty or non-existing class
      if (!cls || !this.classes[cls]) return
      // validate if other active links still use this class
      if (--this.classes[cls] <= 0) {
        if (this.el.classList.contains(cls)) {
          this.el.classList.remove(cls)
        }
        delete this.classes[cls]
      }
    },

    onRouteUpdate () {
      // clear state
      for (var cls in this.classes) {
          this.el.classList.remove(cls)
      }
      this.classes = {}
      this.links = []
    },

    unbind () {
      this.vm.$off(LINK_UPDATE, this.cb)
      this.unwatch && this.unwatch()
    }
  })

  let linkId = 0

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
      // give an ID to link to track state changes
      this.id = String(++linkId)
      // update things when the route changes
      this.unwatch = vm.$watch('$route', bind(this.onRouteUpdate, this))
      // check v-link-active ids
      const activeIds = this.el.getAttribute(LINK_UPDATE)
      if (activeIds) {
        this.el.removeAttribute(LINK_UPDATE)
        this.activeIds = activeIds.split(',')
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
      if (this.activeIds) {
        this.vm.$emit(LINK_UPDATE, this, route.path)
      } else {
        this.updateClasses(route.path)
      }
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

    getActiveClass () {
        return this.activeClass || this.router._linkActiveClass
    },

    isActive (path) {
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
      const activeClass = this.getActiveClass()
      // clear old class
      if (this.prevActiveClass && this.prevActiveClass !== activeClass) {
        toggleClasses(this.el, this.prevActiveClass, removeClass)
      }

      if (this.isActive(path)) {
          toggleClasses(this.el, activeClass, addClass)
      }
      else {
          toggleClasses(this.el, activeClass, removeClass)
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

  // this function is copied from v-bind:class implementation until
  // we properly expose it...
  function toggleClasses (el, key, fn) {
    key = key.trim()
    if (key.indexOf(' ') === -1) {
      fn(el, key)
      return
    }
    var keys = key.split(/\s+/)
    for (var i = 0, l = keys.length; i < l; i++) {
      fn(el, keys[i])
    }
  }
}
