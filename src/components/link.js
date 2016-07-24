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
    tag: String,
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
    const fullPath = resolved.fullPath
    const base = router.history.base
    const href = base ? cleanPath(base + fullPath) : fullPath
    const classes = {}
    const activeClass = this.activeClass || router.options.linkActiveClass || 'router-link-active'
    classes[activeClass] = this.exact
      ? isSameRoute(current, resolved)
      : isIncludedRoute(current, resolved)

    return h(this.tag || 'a', {
      attrs: { href },
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
    }, this.$slots.default)
  }
}
