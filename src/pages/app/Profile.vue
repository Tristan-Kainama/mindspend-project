<script setup>
import { ref, onMounted, computed } from 'vue'
import { supabase } from '../../lib/supabase'

// CHART.JS IMPORT
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title
} from 'chart.js'
import { Doughnut } from 'vue-chartjs'

ChartJS.register(ArcElement, Tooltip, Legend, Title)

// STATE
const isLoaded = ref(false)
const targetUserId = '6d83e2d0-7379-4679-a062-4d2bfc1d7b8b'
const showModal = ref(false)
const selectedEmotion = ref(null)

const emotionCounts = ref({
  Happy: 0, Regret: 0, Calm: 0, Anxiety: 0, Sad: 0, Angry: 0
})

const chartData = ref({
  labels: ['Happy', 'Regret', 'Calm', 'Anxiety', 'Sad', 'Angry'],
  datasets: [{
    data: [0, 0, 0, 0, 0, 0],
    backgroundColor: ['#FFB95A', '#5C60C6', '#1BC0C4', '#973A93', '#0B8FD9', '#CB4F60'],
    borderWidth: 0,
    cutout: '75%'
  }]
})

// KONFIGURASI INSIGHT DINAMIS
const emotionDetails = computed(() => ({
  Happy: {
    color: '#FFB95A',
    short: 'Kamu belanja saat senang 👍...',
    full: `Total pengeluaran saat bahagia: Rp ${emotionCounts.value.Happy.toLocaleString()}.\n\nBagus! Kamu cenderung merayakan momen positif dengan apresiasi diri. Pastikan tetap dalam budget agar kebahagiaan ini bertahan lama.`
  },
  Regret: {
    color: '#5C60C6',
    short: 'Kamu menyesal setelah beli 😅...',
    full: `Total penyesalan: Rp ${emotionCounts.value.Regret.toLocaleString()}.\n\nHati-hati! Seperempat pengeluaranmu berakhir dengan rasa sesal. Cobalah gunakan aturan "tunggu 24 jam" sebelum checkout barang hobi berikutnya.`
  },
  Calm: {
    color: '#1BC0C4',
    short: 'Pengeluaran stabil 😌...',
    full: `Total pengeluaran tenang: Rp ${emotionCounts.value.Calm.toLocaleString()}.\n\nIni adalah kondisi ideal. Kamu membeli barang karena kebutuhan dan dengan pemikiran yang jernih. Pertahankan rasio ini!`
  },
  Anxiety: {
    color: '#973A93',
    short: 'Belanja karena cemas 😟...',
    full: `Total belanja cemas: Rp ${emotionCounts.value.Anxiety.toLocaleString()}.\n\nKamu cenderung mencari pelarian lewat belanja saat stres. Cobalah menggantinya dengan jalan kaki atau meditasi yang gratis namun efektif.`
  },
  Sad: {
    color: '#0B8FD9',
    short: 'Emotional spending 😢...',
    full: `Total belanja sedih: Rp ${emotionCounts.value.Sad.toLocaleString()}.\n\n"Retail therapy" memang menggoda saat sedih, tapi dampaknya pada dompet bisa bikin makin sedih. Coba batasi nominal belanja saat mood sedang turun.`
  },
  Angry: {
    color: '#CB4F60',
    short: 'Impulsive buying 😡...',
    full: `Total belanja impulsif: Rp ${emotionCounts.value.Angry.toLocaleString()}.\n\nBelanja saat marah seringkali tidak terkontrol. Hindari membuka aplikasi e-commerce saat emosi sedang meluap.`
  }
}))

const fetchEmotionData = async () => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('amount, emotion_category, type')
      .eq('user_id', targetUserId)
      .eq('type', 'expense') 

    if (error) throw error
    if (data) processChartData(data)
  } catch (err) {
    console.error("Error:", err)
  } finally {
    isLoaded.value = true
  }
}

const processChartData = (data) => {
  data.forEach(item => {
    if (emotionCounts.value[item.emotion_category] !== undefined) {
      emotionCounts.value[item.emotion_category] += parseFloat(item.amount) || 0
    }
  })

  chartData.value = {
    labels: Object.keys(emotionCounts.value),
    datasets: [{
      data: Object.values(emotionCounts.value),
      backgroundColor: ['#FFB95A', '#5C60C6', '#1BC0C4', '#973A93', '#0B8FD9', '#CB4F60'],
      borderWidth: 0,
      cutout: '75%'
    }]
  }
}

const openInsight = (emotion) => {
  selectedEmotion.value = emotion
  showModal.value = true
}

onMounted(fetchEmotionData)
</script>

<template>
  <div class="bg-[#F8F9FA] min-h-screen pb-20 relative overflow-x-hidden font-sans overflow-y-auto">
    <div class="header-bg"></div>

    <div class="relative z-10 pt-12 px-6">
      <h1 class="text-center text-white text-2xl font-semibold mb-8">Profile</h1>

      <div class="bg-white rounded-[30px] shadow-lg p-6 mb-8 flex flex-col items-center border border-gray-100">
        <p class="text-gray-400 font-bold text-sm tracking-widest mb-4">YOUR EMOTIONS</p>
        <div class="relative w-48 h-48 flex justify-center items-center">
          <Doughnut v-if="isLoaded" :data="chartData" :options="{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }" :key="JSON.stringify(chartData)" />
          <div v-else class="text-gray-300 animate-pulse">Menghitung data...</div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4 px-2">
        <div 
          v-for="(info, name) in emotionDetails" 
          :key="name"
          @click="openInsight(name)"
          :style="{ backgroundColor: info.color }"
          class="p-4 rounded-2xl text-white shadow-sm cursor-pointer active:scale-95 transition-transform"
        >
          <p class="font-bold text-sm mb-1">{{ name }}</p>
          <p class="text-[11px] leading-tight">{{ info.short }}</p>
        </div>
      </div>
    </div>

    <Transition name="fade">
      <div v-if="showModal" class="fixed inset-0 z-[100] flex items-center justify-center px-6">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="showModal = false"></div>
        
        <div class="bg-white rounded-[30px] w-full max-w-sm p-8 relative z-[110] shadow-2xl">
          <div 
            class="w-12 h-12 rounded-full mb-4 flex items-center justify-center text-2xl"
            :style="{ backgroundColor: emotionDetails[selectedEmotion].color + '20', color: emotionDetails[selectedEmotion].color }"
          >
            📊
          </div>
          <h2 class="text-xl font-bold mb-2" :style="{ color: emotionDetails[selectedEmotion].color }">
            {{ selectedEmotion }} Insight
          </h2>
          <p class="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
            {{ emotionDetails[selectedEmotion].full }}
          </p>
          
          <button 
            @click="showModal = false"
            class="w-full mt-6 py-3 rounded-xl bg-gray-100 font-bold text-gray-500 hover:bg-gray-200 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </Transition>

    <!-- Dummy content untuk trigger scrollbar -->
    <div style="height: 300px; opacity: 0;"></div>
  </div>
</template>

<style scoped>
.header-bg {
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 280px;
  background: linear-gradient(180deg, #24A1FD 0%, #3FA9F5 100%);
  border-bottom-left-radius: 60px;
  border-bottom-right-radius: 60px;
  z-index: 0;
}

/* Animasi Fade untuk Modal */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>