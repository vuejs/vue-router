import { cleanPath } from '../util/path'
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
    const activeClass = this.activeClass || router._options.linkActiveClass || 'router-link-active'
    classes[activeClass] = this.exact
      ? current.path === resolved.path
      : current.path.indexOf(resolved.path) === 0

    return h(this.tag || 'a', {
      attrs: { href },
      class: classes,
      on: {
        click: (e) => {
          e.preventDefault()
          router[this.replace ? 'replace' : 'go'](to)
        }
      }
    }, this.$slots.default)
  }
}
