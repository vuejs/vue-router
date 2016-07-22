import { cleanPath, getFullPath } from '../util/path'
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
    append: Boolean,
    replace: Boolean
  },
  render (h) {
    const router = this.$router
    const current = router.history.current
    const to = normalizeLocation(this.to, current, this.append)
    const fullPath = to.name
      ? router.match(to).fullPath
      : getFullPath(to)
    const base = router.history.base
    const href = base ? cleanPath(base + fullPath) : fullPath

    return h(this.tag, {
      attrs: { href },
      on: {
        click: (e) => {
          e.preventDefault()
          router[this.replace ? 'replace' : 'go'](to)
        }
      }
    }, this.$slots.default)
  }
}
