<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../../lib/supabase'

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'

import { Bar, Doughnut } from 'vue-chartjs'

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend
)

// STATE
const transactions = ref([])
const income = ref(0)
const expense = ref(0)
const total = ref(0)
const healthScore = ref(0)
const insight = ref('')

// CHART DATA
const barData = ref({ labels: [], datasets: [] })
const doughnutData = ref({ labels: [], datasets: [] })

const fetchData = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { data } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })

  transactions.value = data || []
  calculateSummary()
  buildCharts()
}

const calculateSummary = () => {
  let inc = 0
  let exp = 0
  transactions.value.forEach(t => {
    if (t.type === 'income') inc += t.amount
    else if (t.type === 'expense') exp += t.amount
  })
  income.value = inc
  expense.value = exp
  total.value = inc - exp
}

const buildCharts = () => {
  // Bar Chart Logic
  const monthly = {}
  transactions.value.forEach(t => {
    const month = new Date(t.created_at).toLocaleString('en-US', { month: 'short' })
    if (!monthly[month]) monthly[month] = { income: 0, expense: 0 }
    if (t.type === 'income') monthly[month].income += t.amount
    else monthly[month].expense += t.amount
  })

  const labels = Object.keys(monthly)
  barData.value = {
    labels,
    datasets: [
      { label: 'Income', data: labels.map(m => monthly[m].income), backgroundColor: '#3B82F6', borderRadius: 4 },
      { label: 'Expense', data: labels.map(m => monthly[m].expense), backgroundColor: '#EF4444', borderRadius: 4 }
    ]
  }

  // Health Score Logic
  const totalTx = transactions.value.length || 1
  const expenseRatio = expense.value / (income.value || 1)
  const negativeEmotions = ['Sad', 'Angry', 'Anxiety', 'Regret']
  const negativeCount = transactions.value.filter(t => negativeEmotions.includes(t.emotion_category)).length
  const negativeRatio = negativeCount / totalTx

  let score = 100
  score -= expenseRatio * 50
  score -= negativeRatio * 40
  if (income.value > expense.value) score += 10
  score = Math.max(0, Math.min(100, Math.round(score)))
  healthScore.value = score
  
  insight.value = score >= 80 ? 'Excellent!' : score >= 60 ? 'Good!' : 'Needs Work'

  doughnutData.value = {
    datasets: [{
      data: [score, 100 - score],
      backgroundColor: ['#00B0DA', '#F3F4F6'],
      borderWidth: 0,
    }]
  }
}

const formatAmount = (val) => {
  if (val >= 1000000) return (val / 1000000).toFixed(1) + 'M'
  if (val >= 1000) return (val / 1000).toFixed(0) + 'K'
  return val
}

// OPTIONS
const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 10 } } } },
  scales: { y: { ticks: { font: { size: 10 } } } }
}

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '80%',
  circumference: 240,
  rotation: 240,
  plugins: { tooltip: { enabled: false }, legend: { display: false } }
}

onMounted(fetchData)
</script>

<template>
  <div class="bg-gray-50 h-screen overflow-auto font-sans pb-20">
    
    <div class="bg-gradient-to-b from-[#00A3FF] to-[#00D1FF] h-56 p-6 text-white text-center relative rounded-b-[40px]">
      <h1 class="text-xl font-semibold mt-2">Monthly Report</h1>
      <div class="absolute right-6 top-8 text-2xl">•••</div>
      
      <div class="absolute left-6 right-6 top-24 bg-white rounded-3xl p-5 shadow-sm border border-gray-100 text-gray-800 z-10">
        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">This Month</p>
        <div class="grid grid-cols-3 gap-2">
          <div class="bg-[#F8FFFA] border border-gray-100 rounded-xl p-2">
            <p class="text-[9px] text-[#7B61FF] font-bold mb-1">Income</p>
            <p class="text-xs font-bold">{{ formatAmount(income) }}</p>
          </div>
          <div class="bg-[#FFF8FB] border border-gray-100 rounded-xl p-2">
            <p class="text-[9px] text-[#7B61FF] font-bold mb-1">Expense</p>
            <p class="text-xs font-bold">{{ formatAmount(expense) }}</p>
          </div>
          <div class="bg-[#F8FBFF] border border-gray-100 rounded-xl p-2">
            <p class="text-[9px] text-[#7B61FF] font-bold mb-1">Total</p>
            <p class="text-xs font-bold">{{ formatAmount(total) }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="px-6 mt-20 space-y-4">
      
      <div class="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 text-center">This Month</p>
        <div class="h-44">
          <Bar :data="barData" v-if="barData.datasets.length" :options="barOptions" />
        </div>
      </div>

      <div class="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 overflow-hidden">
        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 text-center">Financial Health Score</p>
        
        <div class="relative h-40 w-full flex justify-center items-center">
          <div class="h-32 w-32"> 
            <Doughnut 
              v-if="doughnutData.datasets.length"
              :data="doughnutData" 
              :options="doughnutOptions" 
            />
          </div>
          
          <div class="absolute inset-0 flex flex-col justify-center items-center">
            <span class="text-3xl font-extrabold text-gray-800 leading-none">{{ healthScore }}</span>
            <span class="text-[#00B0DA] text-[10px] font-bold uppercase">{{ insight }}</span>
          </div>
        </div>
      </div>
      </div>
    </div></template>

<style scoped>
/* Ensure standard sizing for canvas elements */
canvas {
  max-width: 100% !important;
}
</style>