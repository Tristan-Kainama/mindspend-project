<script setup>
import { isLoading } from '../composables/useLoader'
</script>

<template>
  <transition name="fade">
    <div v-if="isLoading" class="loader-overlay">
      <img src="../images/Logo.png" alt="Loading..." class="loader-image" />
    </div>
  </transition>
</template>

<style scoped>
.loader-overlay {
  position: fixed;
  inset: 0;
  background: white;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

/* ukuran gambar */
.loader-image {
  width: 350px;
  height: auto;
}

/* fade animation */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>