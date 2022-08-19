import { getCurrentInstance, shallowReactive, effectScope, onUnmounted } from 'vue'

export function useRouter () {
  const i = getCurrentInstance()
  if (process.env.NODE_ENV !== 'production' && !i) {
    throwNoCurrentInstance('useRouter')
  }

  return i.proxy.$root.$router
}

export function useRoute () {
  const i = getCurrentInstance()
  if (process.env.NODE_ENV !== 'production' && !i) {
    throwNoCurrentInstance('useRoute')
  }

  const root = i.proxy.$root
  if (!root._$route) {
    const route = effectScope(true).run(
      () => shallowReactive(Object.assign({}, root.$router.currentRoute))
    )
    root._$route = route

    root.$router.afterEach(to => {
      Object.assign(route, to)
    })
  }

  return root._$route
}

// TODO:
// export function useLink () {}

export function onBeforeRouteUpdate (guard) {
  const i = getCurrentInstance()
  if (process.env.NODE_ENV !== 'production' && !i) {
    throwNoCurrentInstance('onBeforeRouteUpdate')
  }

  const router = useRouter()

  let target = i.proxy
  // find the nearest routerview to know the depth
  while (target && target.$vnode && target.$vnode.data && target.$vnode.data.routerViewDepth == null) {
    target = target.$parent
  }

  const depth = target && target.$vnode && target.$vnode.data ? target.$vnode.data.routerViewDepth : null

  console.log('found depth', depth)

  // TODO: allow multiple guards?
  i.proxy.$options.beforeRouteUpdate = guard

  const removeGuard = router.beforeEach((to, from, next) => {
    // TODO: check it's an update
    return guard(to, from, next)
  })

  onUnmounted(removeGuard)

  return removeGuard
}

// TODO:
// export function onBeforeRouteLeave () {}

function throwNoCurrentInstance (method) {
  throw new Error(
    `[vue-router]: Missing current instance. ${method}() must be called inside <script setup> or setup().`
  )
}
