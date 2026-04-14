<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToLogin = () => {
  router.push('/login')
}

const goToRegister = () => {
  router.push('/register')
}
</script>

<template>
  <div class="flex flex-col items-center justify-center h-screen gap-4">
    <h1 class="text-2xl font-bold">MindSpend</h1>

    <button 
      @click="goToLogin"
      class="px-4 py-2 bg-blue-500 text-white rounded-lg"
    >
      Login
    </button>

    <button 
      @click="goToRegister"
      class="px-4 py-2 bg-green-500 text-white rounded-lg"
    >
      Register
    </button>
  </div>
</template>
