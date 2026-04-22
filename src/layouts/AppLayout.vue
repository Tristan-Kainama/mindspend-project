<script setup>
import { ref } from 'vue'
import Sidebar from '../components/layout/Sidebar.vue'
import GlobalLoader from '../components/GlobalLoader.vue'

const isOpen = ref(false)

const toggleSidebar = () => {
  isOpen.value = !isOpen.value
}

const closeSidebar = () => {
  isOpen.value = false
}


</script>

<template>
  <div class="relative min-h-screen bg-gray-100 flex justify-center">

    <!-- MOBILE FRAME -->
    <div class="w-[430px] h-[932px] bg-white relative overflow-hidden">

      <!-- HAMBURGER BUTTON -->
      <div class="absolute top-2 left-6 z-20">
        <button
          @click="toggleSidebar"
          class="w-8 h-8 bg-white rounded-[30%] shadow-md flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5 text-gray-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <!-- OVERLAY -->
      <div
        v-if="isOpen"
        @click="closeSidebar"
        class="absolute inset-0 bg-black/30 z-30"
      ></div>

      <!-- SIDEBAR DRAWER -->
      <div
        class="absolute top-0 left-0 h-full z-40 transform transition-transform duration-300"
        :class="isOpen ? 'translate-x-0' : '-translate-x-full'"
      >
        <Sidebar @close="closeSidebar" />
      </div>

      <!-- MAIN CONTENT -->
      <div class="h-full overflow-y-auto">
        <router-view />
        <GlobalLoader />
      </div>

    </div>

  </div>
</template>