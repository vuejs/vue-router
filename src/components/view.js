export default {
  name: 'router-view',
  props: {
    name: {
      type: String,
      default: 'default'
    }
  },
  created () {
    this._routerView = true
    let parent = this.$parent
    let depth = 0
    while (parent) {
      if (parent._routerView) {
        depth++
      }
      parent = parent.$parent
    }
    this.depth = depth
  },
  render (h) {
    return h(
      this.$route.matched[this.depth].components[this.name],
      null,
      // this.$options._parentVnode.data,
      () => this.$slots.default
    )
  }
}
