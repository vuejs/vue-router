import { getCurrentInstance, computed } from '@vue/composition-api'

export const useRoute = () => {
  const { proxy } = getCurrentInstance()
  const route = computed(() => proxy.$route)
  return route
}

export const useRouter = () => {
  const { proxy } = getCurrentInstance()
  const router = computed(() => proxy.$router)
  return router
}
