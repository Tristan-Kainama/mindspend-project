<script setup>
import { ref, onMounted } from 'vue'
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
const chartData = ref({
  labels: ['Happy', 'Regret', 'Calm', 'Anxiety', 'Sad', 'Angry'],
  datasets: [{
    data: [0, 0, 0, 0, 0, 0],
    backgroundColor: ['#FFB95A', '#5C60C6', '#1BC0C4', '#973A93', '#0B8FD9', '#CB4F60'],
    borderWidth: 0,
    cutout: '75%'
  }]
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false }
  }
}

// FETCH DATA DARI SUPABASE
const fetchEmotionData = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Ambil data pengeluaran (expense) saja untuk grafik emosi belanja
    const { data, error } = await supabase
      .from('transactions')
      .select('amount, emotion_category, type')
      .eq('user_id', user.id)
      .eq('type', 'expense') 

    if (error) throw error
    
    if (data && data.length > 0) {
      processChartData(data)
    }
  } catch (err) {
    console.error("Gagal mengambil data:", err)
  } finally {
    isLoaded.value = true
  }
}

// PROSES DATA SQL KE FORMAT CHART
const processChartData = (data) => {
  // Mapping sesuai dengan kolom 'emotion_category' di SQL kamu
  const counts = {
    Happy: 0,
    Regret: 0,
    Calm: 0,
    Anxiety: 0,
    Sad: 0,
    Angry: 0
  }

  data.forEach(item => {
    const cat = item.emotion_category
    if (counts[cat] !== undefined) {
      counts[cat] += parseFloat(item.amount) || 0
    }
  })

  const labels = Object.keys(counts)
  const values = Object.values(counts)
  
  // Update chartData dengan object baru agar reaktif
  chartData.value = {
    labels: labels,
    datasets: [{
      data: values,
      backgroundColor: ['#FFB95A', '#5C60C6', '#1BC0C4', '#973A93', '#0B8FD9', '#CB4F60'],
      borderWidth: 0,
      cutout: '75%'
    }]
  }
}

onMounted(fetchEmotionData)
</script>

<template>
  <div class="bg-[#F8F9FA] min-h-full pb-10 relative overflow-x-hidden font-sans">
    
    <div class="header-bg"></div>

    <div class="relative z-10 pt-12 px-6">
      <h1 class="text-center text-white text-2xl font-semibold mb-8">Profile</h1>

      <div class="bg-white rounded-[30px] shadow-lg p-6 mb-8 flex flex-col items-center border border-gray-100">
        <p class="text-gray-400 font-bold text-sm tracking-widest mb-4">YOUR EMOTIONS</p>
        
        <div class="relative w-48 h-48 flex justify-center items-center">
          <Doughnut 
            v-if="isLoaded"
            :data="chartData" 
            :options="chartOptions" 
            :key="JSON.stringify(chartData)"
          />
          <div v-else class="text-gray-300 animate-pulse">Menghitung data...</div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4 px-2">
        <div class="bg-[#FFB95A] p-4 rounded-2xl text-white shadow-sm">
          <p class="font-bold text-sm mb-1">Happy</p>
          <p class="text-[11px] leading-tight">Kamu belanja saat senang 👍</p>
        </div>

        <div class="bg-[#5C60C6] p-4 rounded-2xl text-white shadow-sm">
          <p class="font-bold text-sm mb-1">Regret</p>
          <p class="text-[11px] leading-tight">Kamu menyesal setelah beli 😅</p>
        </div>

        <div class="bg-[#1BC0C4] p-4 rounded-2xl text-white shadow-sm">
          <p class="font-bold text-sm mb-1">Calm</p>
          <p class="text-[11px] leading-tight">Pengeluaran stabil 😌</p>
        </div>

        <div class="bg-[#973A93] p-4 rounded-2xl text-white shadow-sm">
          <p class="font-bold text-sm mb-1">Anxiety</p>
          <p class="text-[11px] leading-tight">Belanja karena cemas 😟</p>
        </div>

        <div class="bg-[#0B8FD9] p-4 rounded-2xl text-white shadow-sm">
          <p class="font-bold text-sm mb-1">Sad</p>
          <p class="text-[11px] leading-tight">Emotional spending 😢</p>
        </div>

        <div class="bg-[#CB4F60] p-4 rounded-2xl text-white shadow-sm">
          <p class="font-bold text-sm mb-1">Angry</p>
          <p class="text-[11px] leading-tight">Impulsive buying 😡</p>
        </div>
      </div>

      <!-- Dummy content to enable scrolling -->
      <div class="mt-8 space-y-4">
        <div class="bg-gray-200 p-4 rounded-2xl">
          <p class="text-gray-700"></p>
        </div>
        <div class="bg-gray-200 p-4 rounded-2xl">
          <p class="text-gray-700">Dummy content 2</p>
        </div>
        <div class="bg-gray-200 p-4 rounded-2xl">
          <p class="text-gray-700">Dummy content 3</p>
        </div>
        <div class="bg-gray-200 p-4 rounded-2xl">
          <p class="text-gray-700">Dummy content 4</p>
        </div>
        <div class="bg-gray-200 p-4 rounded-2xl">
          <p class="text-gray-700">Dummy content 5</p>
        </div>
      </div>
    </div>
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
</style>