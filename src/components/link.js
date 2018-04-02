/* @flow */

import { createRoute, isSameRoute, isIncludedRoute } from '../util/route'
import { _Vue } from '../install'

// work around weird flow bug
const toTypes: Array<Function> = [String, Object]
const eventTypes: Array<Function> = [String, Array]

export default {
  name: 'RouterLink',
  functional: true,
  props: {
    to: {
      type: toTypes,
      required: true
    },
    tag: {
      type: String,
      default: 'a'
    },
    exact: Boolean,
    append: Boolean,
    replace: Boolean,
    activeClass: String,
    exactActiveClass: String,
    event: {
      type: eventTypes,
      default: 'click'
    }
  },
  render (h: Function, { props, children, parent, data }: any) {
    const router = parent.$router
    const current = parent.$route
    const { location, route, href } = router.resolve(props.to, current, props.append)

    const classes = {}
    const globalActiveClass = router.options.linkActiveClass
    const globalExactActiveClass = router.options.linkExactActiveClass
    // Support global empty active class
    const activeClassFallback = globalActiveClass == null
      ? 'router-link-active'
      : globalActiveClass
    const exactActiveClassFallback = globalExactActiveClass == null
      ? 'router-link-exact-active'
      : globalExactActiveClass
    const activeClass = props.activeClass == null
      ? activeClassFallback
      : props.activeClass
    const exactActiveClass = props.exactActiveClass == null
      ? exactActiveClassFallback
      : props.exactActiveClass
    const compareTarget = location.path
      ? createRoute(null, location, null, router)
      : route
    const extend = _Vue.util.extend

    classes[exactActiveClass] = isSameRoute(current, compareTarget)
    classes[activeClass] = props.exact
      ? classes[exactActiveClass]
      : isIncludedRoute(current, compareTarget)

    const handler = e => {
      if (guardEvent(e)) {
        if (props.replace) {
          router.replace(location)
        } else {
          router.push(location)
        }
      }
    }

    data.class = extend(data.class || {}, classes)

    const on = { click: guardEvent }
    if (Array.isArray(props.event)) {
      props.event.forEach(e => { on[e] = handler })
    } else {
      on[props.event] = handler
    }

    if (props.tag === 'a') {
      data.on = on
      data.attrs = { href }
    } else {
      // find the first <a> child and apply listener and href
      const a = findAnchor(children)
      if (a) {
        // in case the <a> is a static node
        a.isStatic = false
        const aData = a.data = extend({}, a.data)
        aData.on = on
        const aAttrs = a.data.attrs = extend({}, a.data.attrs)
        aAttrs.href = href
      } else {
        // doesn't have <a> child, apply listener to self
        data.on = on
      }
    }

    return h(props.tag, data, children)
  }
}

function guardEvent (e) {
  // don't redirect with control keys
  if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) return
  // don't redirect when preventDefault called
  if (e.defaultPrevented) return
  // don't redirect on right click
  if (e.button !== undefined && e.button !== 0) return
  // don't redirect if `target="_blank"`
  if (e.currentTarget && e.currentTarget.getAttribute) {
    const target = e.currentTarget.getAttribute('target')
    if (/\b_blank\b/i.test(target)) return
  }
  // this may be a Weex event which doesn't have this method
  if (e.preventDefault) {
    e.preventDefault()
  }
  return true
}

function findAnchor (children) {
  if (children) {
    let child
    for (let i = 0; i < children.length; i++) {
      child = children[i]
      if (child.tag === 'a') {
        return child
      }
      if (child.children && (child = findAnchor(child.children))) {
        return child
      }
    }
  }
}
