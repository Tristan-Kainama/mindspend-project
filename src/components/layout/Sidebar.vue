<script setup>
import { useRouter } from 'vue-router'
import { supabase } from '../../lib/supabase'

// ICONS
import {
  Home,
  Wallet,
  BarChart3,
  MessageCircle,
  User
} from 'lucide-vue-next'

const router = useRouter()
const emit = defineEmits(['close'])

const goTo = (path) => {
  router.push(path)
  emit('close')
}

const logout = async () => {
  await supabase.auth.signOut()
  router.push('/')
}
</script>

<template>
  <div class="w-[260px] h-full bg-[#F5F5F5] p-6 flex flex-col">

    <!-- LOGO -->
    <div class="flex flex-col items-center mb-10">
      <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-md">
        <Wallet class="w-6 h-6 text-white" />
      </div>
      <p class="mt-3 font-semibold text-sm">MindSpend</p>
    </div>

    <!-- MENU -->
    <div class="flex flex-col gap-6 text-gray-700 text-sm">

      <!-- HOME -->
      <button
        @click="goTo('/app/home')"
        class="flex items-center gap-4"
      >
        <Home class="w-5 h-5 text-gray-500" />
        <span>Home</span>
      </button>

      <!-- BUDGET -->
      <button
        @click="goTo('/app/add')"
        class="flex items-center gap-4"
      >
        <Wallet class="w-5 h-5 text-gray-500" />
        <span>Budget</span>
      </button>

      <!-- STATUS -->
      <button
        @click="goTo('/app/report')"
        class="flex items-center gap-4"
      >
        <BarChart3 class="w-5 h-5 text-gray-500" />
        <span>Status</span>
      </button>

      <!-- CHAT -->
      <button
        @click="goTo('/app/chat')"
        class="flex items-center gap-4"
      >
        <MessageCircle class="w-5 h-5 text-gray-500" />
        <span>Chat</span>
      </button>

      <!-- PROFILE -->
      <button
        @click="goTo('/app/profile')"
        class="flex items-center gap-4"
      >
        <User class="w-5 h-5 text-gray-500" />
        <span>Profile</span>
      </button>

    </div>

    <div class="flex-1"></div>

    <!-- LOGOUT -->
    <button
      @click="logout"
      class="text-red-500 text-sm mt-6"
    >
      Logout
    </button>

  </div>
</template>