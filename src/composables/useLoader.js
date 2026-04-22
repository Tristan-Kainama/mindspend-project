import { ref } from 'vue'

export const isLoading = ref(false)

export const showLoader = () => {
  isLoading.value = true
}

export const hideLoader = () => {
  isLoading.value = false
}