import {
  getCurrentInstance,
  shallowReactive,
  effectScope,
  onUnmounted
} from 'vue'

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
    const route = effectScope(true).run(() =>
      shallowReactive(Object.assign({}, root.$router.currentRoute))
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

  return useFilteredGuard(guard, isUpdateNavigation)
}

function useFilteredGuard (guard, fn) {
  const i = getCurrentInstance()
  const router = useRouter()

  let target = i.proxy
  // find the nearest RouterView to know the depth
  while (
    target &&
    target.$vnode &&
    target.$vnode.data &&
    target.$vnode.data.routerViewDepth == null
  ) {
    target = target.$parent
  }

  const depth =
    target && target.$vnode && target.$vnode.data
      ? target.$vnode.data.routerViewDepth
      : null

  if (depth != null) {
    const removeGuard = router.beforeEach((to, from, next) => {
      return fn(to, from, depth) ? guard(to, from, next) : next()
    })

    onUnmounted(removeGuard)
    return removeGuard
  }

  return noop
}

function isUpdateNavigation (to, from, depth) {
  const toMatched = to.matched
  const fromMatched = from.matched
  return (
    toMatched.length >= depth &&
    toMatched
      .slice(0, depth + 1)
      .every((record, i) => record === fromMatched[i])
  )
}

function isLeaveNavigation (to, from, depth) {
  const toMatched = to.matched
  const fromMatched = from.matched
  return toMatched.length < depth || toMatched[depth] !== fromMatched[depth]
}

const noop = () => {}

export function onBeforeRouteLeave (guard) {
  const i = getCurrentInstance()
  if (process.env.NODE_ENV !== 'production' && !i) {
    throwNoCurrentInstance('onBeforeRouteLeave')
  }

  return useFilteredGuard(guard, isLeaveNavigation)
}

function throwNoCurrentInstance (method) {
  throw new Error(
    `[vue-router]: Missing current instance. ${method}() must be called inside <script setup> or setup().`
  )
}
