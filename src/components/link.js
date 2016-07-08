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
    }
  },
  render (h) {
    return h(this.tag, {
      attrs: {
        href: this.to
      },
      on: {
        click: (e) => {
          e.preventDefault()
          this.$router.go(this.to)
        }
      }
    }, this.$slots.default)
  }
}
