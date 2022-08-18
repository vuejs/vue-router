import { getCurrentInstance, shallowReactive, effectScope } from 'vue'

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

// TODO:
// export function onBeforeRouteUpdate () {}

// TODO:
// export function onBeforeRouteLeave () {}

function throwNoCurrentInstance (method) {
  throw new Error(
    `[vue-router]: Missing current instance. ${method}() must be called inside <script setup> or setup().`
  )
}
