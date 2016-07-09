import View from './components/view'
import Link from './components/link'

export function install (Vue) {
  Object.defineProperty(Vue.prototype, '$router', {
    get () { return this.$root._router }
  })

  Object.defineProperty(Vue.prototype, '$route', {
    get () { return this.$root._route }
  })

  Vue.mixin({
    beforeCreate () {
      if (this.$options.router) {
        this._router = this.$options.router
        this._router._rootComponent = this
        const initialRoute = this._router.match(this._router.history.current)
        Vue.util.defineReactive(this, '_route', initialRoute)
      }
    }
  })

  Vue.component('router-view', View)
  Vue.component('router-link', Link)
}
