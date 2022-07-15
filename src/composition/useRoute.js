import { getCurrentInstance, computed } from '@vue/composition-api'

export const useRoute = () => {
  const instance = getCurrentInstance()
  const route = computed(() => instance?.proxy.$route)
  return route
}

export const useRouter = () => {
  const instance = getCurrentInstance()
  const router = computed(() => instance?.proxy.$router)
  return router
}
