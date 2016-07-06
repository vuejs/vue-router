export default {
  name: 'router-link',
  functional: true,
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
  render (h, { props, children, parent }) {
    return h(props.tag, {
      attrs: {
        href: props.to
      },
      on: {
        click: (e) => {
          e.preventDefault()
          parent.$router.go(props.to)
        }
      }
    }, children)
  }
}
