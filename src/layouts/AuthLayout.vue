<script setup>
</script>

<template>
  <div class="relative min-h-screen bg-gray-100 flex justify-center">

    <!-- MOBILE FRAME -->
    <div class="w-[430px] h-[932px] bg-white relative overflow-hidden">

      <!-- CONTENT -->
      <div class="h-full overflow-y-scroll">
        <router-view />
      </div>

    </div>

  </div>
</template>