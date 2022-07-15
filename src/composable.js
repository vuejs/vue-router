import { getCurrentInstance, reactive, watchEffect } from 'vue'
import { assert } from './util/warn'

/**
 * Returns the current route location. Equivalent to using `$route` inside
 * templates.
 */
export function useRoute () {
  const instance = getCurrentInstance()
  assert(instance, `useRoute must be used inside a setup context`)
  const route = reactive(Object.assign({}, instance.proxy.$root.$route))
  watchEffect(() => {
    Object.assign(route, instance.proxy.$root.$route)
  })

  return route
}

/**
 * Returns the router instance. Equivalent to using `$router` inside
 * templates.
 */
export function useRouter () {
  const instance = getCurrentInstance()
  assert(instance, `useRouter must be used inside a setup context`)
  const router = instance.proxy.$root.$router
  watchEffect(() => {
    if (router) {
      Object.assign(router, instance.proxy.$root.$router)
    }
  })
  return router
}

// TODO: function useLink(props) { }
// TODO: function onBeforeRouteLeave(leaveGuard) { }
// TODO: function onBeforeRouteUpdate(updateGuard) { }

