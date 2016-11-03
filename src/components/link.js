/* @flow */

import { createRoute, isSameRoute, isIncludedRoute } from '../util/route'
import { normalizeLocation } from '../util/location'

// work around weird flow bug
const toTypes: Array<Function> = [String, Object]

export default {
  name: 'router-link',
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
    activeClass: String
  },
  render (h: Function) {
    const router = this.$router
    const current = this.$route
    const {href, resolved, normalizedTo} = router.resolve(this.to, current, this.append)
    const classes = {}
    const activeClass = this.activeClass || router.options.linkActiveClass || 'router-link-active'
    const compareTarget = normalizedTo.path ? createRoute(null, normalizedTo) : resolved
    classes[activeClass] = this.exact
      ? isSameRoute(current, compareTarget)
      : isIncludedRoute(current, compareTarget)

    const on = {
      click: (e) => {
        // don't redirect with control keys
        /* istanbul ignore if */
        if (e.metaKey || e.ctrlKey || e.shiftKey) return
        // don't redirect when preventDefault called
        /* istanbul ignore if */
        if (e.defaultPrevented) return
        // don't redirect on right click
        /* istanbul ignore if */
        if (e.button !== 0) return
        e.preventDefault()
        if (this.replace) {
          router.replace(to)
        } else {
          router.push(to)
        }
      }
    }

    const data: any = {
      class: classes
    }

    if (this.tag === 'a') {
      data.on = on
      data.attrs = { href }
    } else {
      // find the first <a> child and apply listener and href
      const a = findAnchor(this.$slots.default)
      if (a) {
        const aData = a.data || (a.data = {})
        aData.on = on
        const aAttrs = aData.attrs || (aData.attrs = {})
        aAttrs.href = href
      } else {
        // doesn't have <a> child, apply listener to self
        data.on = on
      }
    }

    return h(this.tag, data, this.$slots.default)
  }
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
