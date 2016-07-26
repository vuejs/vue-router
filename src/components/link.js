import { cleanPath } from '../util/path'
import { isSameRoute, isIncludedRoute } from '../util/route'
import { normalizeLocation } from '../util/location'

export default {
  name: 'router-link',
  props: {
    to: {
      type: [String, Object],
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
  render (h) {
    const router = this.$router
    const current = this.$route
    const to = normalizeLocation(this.to, current, this.append)
    const resolved = router.match(to)
    const fullPath = resolved.redirectedFrom || resolved.fullPath
    const base = router.history.base
    const href = base ? cleanPath(base + fullPath) : fullPath
    const classes = {}
    const activeClass = this.activeClass || router.options.linkActiveClass || 'router-link-active'
    classes[activeClass] = this.exact
      ? isSameRoute(current, resolved)
      : isIncludedRoute(current, resolved)

    const data = {
      class: classes,
      on: {
        click: (e) => {
          e.preventDefault()
          if (this.replace) {
            router.replace(to)
          } else {
            router.push(to)
          }
        }
      }
    }

    if (this.tag === 'a') {
      data.attrs = { href }
    } else {
      // find the first <a> child and apply href
      const a = findAnchor(this.$slots.default)
      if (a) {
        const aData = a.data || (a.data = {})
        const aAttrs = aData.attrs || (aData.attrs = {})
        aAttrs.href = href
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
