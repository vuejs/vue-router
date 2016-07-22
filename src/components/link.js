import { cleanPath, getFullPath } from '../util/path'
import { normalizeLocation, isSameLocation } from '../util/location'

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
    append: Boolean,
    replace: Boolean,
    activeClass: {
      type: String,
      default: 'router-link-active'
    }
  },
  render (h) {
    const router = this.$router
    const current = router.history.current
    const to = normalizeLocation(this.to, current, this.append)
    const resolved = router.match(to)
    const fullPath = resolved.fullPath
    const base = router.history.base
    const href = base ? cleanPath(base + fullPath) : fullPath
    const classes = {}
    classes[this.activeClass] = isSameLocation(resolved, this.$route)

    return h(this.tag, {
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
